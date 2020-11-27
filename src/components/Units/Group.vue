<template>
    <div class="unit-group" :style="transformation">
        <div class="unit-group__header" :style="computedHeader">
            <div class="unit-group__header__text single-line input"
            :contenteditable="editmode"
            @keydown="keydown">{{text}}</div> 
            <div class="unit-group__header__type">G</div>
        </div>
        <div class="unit-group__items" :style="computedSize"></div>
        <div class="connector">
            <div class="connector-left"></div>
            <div class="connector-right"></div>
            <div class="connector-enum"></div>
        </div>
    </div>
</template>

<script>
import Unit from '../Unit';
import {Point} from '../../assets/js/unit-classes';

export default {
    mixins: [Unit],
    data: function() {
        return {
            // View data 
            width: 0,
            height: 0,
            leftmostX: 0,
            upperboundY: 0,
            lowerboundY: 0,
            groupZindex: 0,
            // Controller data
            containedUnits: [],
        }
    },

    mounted: function() {
        // let self = this;
        
        /* Every rendered element has a ref attribute in the DOM level as a unique id */
        this.$el.ref = this.unit.getUID();
        this.text = this.unit.getText();

        /* Position element */
        this.left = this.unit.xpos();
        this.top = this.unit.ypos();


        /* Create vue components  */
        this.loadItemsFromDB();

        this.setHeightAndWidth();
        
        this.handleEditLogic();
    },
        // updated: function() {
        //     console.log(this.editmode);
        // },
    methods: {
        /* Move unit */
        moveBy: function() { 
            
        },
        internalScaleTo: function(cx, cy, scaleBy) {
            this.scale *= scaleBy;
        },
        /* Unit methods */
        getUnit: function() {
            return this.unit;
        },
        /* Drag & Drop methods  */
        onDragStart: function() {
            // Update global z-index and future values 
            // this.$emit('unitdragstart');
            
            /* Update global z-index and future values */
            this.$el.dispatchEvent(new Event('unitdragstart'));
            
            /* Move the element upwards */
            // this.groupZindex= this.zIndex - 1000;

        },
        onDrag: function (dx,dy) {
            let board = this.$parent;
            // this.left += dx;
            // this.top += dy;

            this.containedUnits.forEach((unit) => {
                unit.moveBy(dx,dy);
                if (unit.unit.getType() ===  "Relation") {
                    if (board.$refs[unit.unit.getSrcId()].unit.getType() === "Point") {
                        board.$refs[unit.unit.getSrcId()].moveBy(dx,dy);
                    }
                    if (board.$refs[unit.unit.getDestId()].unit.getType() === "Point") {
                        board.$refs[unit.unit.getDestId()].moveBy(dx,dy);
                    }
                }
                // console.log(unit);
            });
        },
        onDragEnd: function() {
            // this.$emit('unitdragend');
        },
        onDelete: async function () {
            let board = this.$parent;
            var x,y,point, elRect = this.$el.getBoundingClientRect();


            for (const lineId of this.lines) {
                let line = board.$refs[lineId];

                x = this.left + elRect.width/2 - 5*this.scale;
                y = this.top + elRect.height/2 - 5*this.scale;
                point = new Point(x,y,this.unit.getType());

                /* Detach connected relations upon deletion */
                if (line.src.unit.getType() === "Relation" && line.src.unit.getUID() !== this.unit.getUID()) {
                    if (line.src.unit.getDestId() === this.unit.getUID()) {
                        await board.addUnitOnRuntime(point);
                        await line.src.changeDestOnRuntime(point.getUID());
                    } else {
                        await board.deleteLineOnRuntime(lineId);
                    }
                }
                else if (line.dest.unit.getType() === "Relation" && line.dest.unit.getUID() !== this.unit.getUID()) {
                    if (line.dest.unit.getSrcId() === this.unit.getUID()) {
                        await board.addUnitOnRuntime(point);
                        await line.dest.changeSrcOnRuntime(point.getUID());
                    } else {
                        await board.deleteLineOnRuntime(lineId);
                    }
                }
                else if (line.options.isInfoToEnum) {
                    let enumUnit = line.dest;
                    enumUnit.unit.setItemId(null);
                }

                if (line.src.unit.getUID() === this.unit.getUID()) {
                    await board.deleteLineOnRuntime(lineId);
                }
                if (line.dest.unit.getUID() === this.unit.getUID()) {
                    await board.deleteLineOnRuntime(lineId);
                }
            }


            for (const item of this.containedUnits) {
                if (item.groupContainer) {
                    item.groupContainer = null;
                }
            }
            board.deleteUnitOnRuntime(this.$el.ref);                
        },
        addItem(itemId) {
            this.unit.addItem(itemId);
            this.loadItemsFromDB();
        },
        removeItem(itemId) {
            console.log(`Removing ${itemId}`);
            this.unit.removeItem(itemId);
            this.loadItemsFromDB();

            if (!this.containedUnits) {
                console.log('oiminuiauinds');
                this.onDelete();
            }
        },
        loadItemsFromDB(){
            let self = this;
            self.containedUnits = [];
            this.unit.getContainedUnits().forEach((unitId)=>{
                let unit = self.$parent.$refs[unitId];
                if (unit) {
                    unit.groupContainer = self;
                    self.containedUnits.push(unit);   
                    unit.$el.classList.remove('selected');
                }
            });
        },
        setHeightAndWidth: function() {
            // if(this.containedUnits.length === 0) this.onDelete();
            let self = this;
            let padding = 10*this.scale;
            let rightmostX = -99999, leftmostX = 99999;
            let upperboundY = 99999, lowerboundY = -99999;
            let minZindex = this.groupZindex;

            /* determine group element boundries */
            this.containedUnits.forEach(unit => {
                let unitEl = unit.$el;
                rightmostX = Math.max(rightmostX, unit.left + unitEl.offsetWidth*self.scale);
                leftmostX = Math.min(leftmostX, unit.left);
                upperboundY = Math.min(upperboundY, unit.top);
                lowerboundY = Math.max(lowerboundY, unit.top + unitEl.offsetHeight*self.scale);
                minZindex = Math.min(minZindex, unit.zIndex);
            });

            /* Add 10px padding to edges */
            upperboundY -= padding;
            leftmostX -= padding;
            lowerboundY += padding;
            rightmostX += padding;

            /* Base position on UI according to boundries */
            this.left = leftmostX;
            this.top = upperboundY;


            // /* Determine width and height of items container */
            this.width = (rightmostX - leftmostX) /this.scale;
            this.height = (lowerboundY - upperboundY)/this.scale;
            this.groupZindex = minZindex;

            requestAnimationFrame(this.setHeightAndWidth);
        },
        /* position attached lines */
        updateLines() {
            let board = this.$parent;
            for (const lineId of this.lines) {
                if (board.$refs[lineId]) {
                    board.$refs[lineId].updateLine();
                }
            }
        },
    },
    computed: {
        transformation () {
            return {
                transform: `translate3d(${this.left}px,${this.top}px, 0) scale(${this.scale})`,
                fontSize: 13+ 'px',
                zIndex: this.groupZindex
            }
        },
        computedSize: function(){
            return {
                // width: `${this.width}px`,
                height: `${this.height}px`,
                zIndex: this.groupZindex
            }
        },
        computedWidth: function() {
            return {
                width: `${this.width}px`,
            }
        },
        computedHeader: function() {
            return {
                minWidth: `${this.width}px`,
                background: 'white'
            }
        },
    },
    props: 
    {
        unit: {
            type: Object
        },
        zIndex: {
            type: Number
        },
        isBoardRendered: {
            type: Boolean
        }
    },
    watch: {
        left: function(){
            this.updateLines();
        },
        top: function() {
            this.updateLines();
        },
        height: function() {
            this.updateLines()
        },
        width: function() {
            this.updateLines();
        },
        text: function() {
            if (!this.text) {
                this.editmode = true;
            }
            this.unit.setText(this.text);
        },
        isBoardRendered: function() {
            this.setHeightAndWidth();
        }
    }
}
</script>

<style lang="scss" scoped>
    .unit-group {
        display: flex;
        flex-direction: column;
        background-color: rgba(255, 255, 255, 0.10);
        border: none;
        padding: 0;
        z-index: 99999;

        &__header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-weight: 900;
            padding: 10px;
            border: 2px solid rgba(255, 87, 51, .6);
            border-bottom-right-radius: 12px;
            border-bottom-left-radius: 12px;
            order: 1;

            &__text {
                order: 1;
                min-width: 50px;
                align-self: center;  
                margin-left: 10px;  
            }
            &__type {
                order: 0;
                border-radius: 100%;
                color: black;
                text-align: center;
                height: 30px;
                min-width: 30px;
                margin: auto;
                margin-left: 0;
                font-size: 17px;
                outline:solid black 1px;
                align-self: center;   
            }
        }

        &__items {
            display: block;
            height: 100%;
            width: 100%;
            order: 0;
            border-top: 3px dashed rgba(255, 87, 51, .6);
            border-right: 3px dashed rgba(255, 87, 51, .6);
            border-left: 3px dashed rgba(255, 87, 51, .6);
        }

        &__connector {
            &-left {
                position: absolute;
                top: 50%;
                left: 0%;
            }
            &-right {
                position: absolute;
                top: 50%;
                left: 100%;
            }
            &-enum {
                position: absolute;
                top: 50%;
                left: 50%;
            }
        }
    }

</style>