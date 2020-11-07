<template>
    <div class="unit-group" :style="transformation">
        <div class="unit-group__header" :style="computedHeader">
            <div class="unit-group__header__text single-line input"
            :contenteditable="editmode"
            @keydown="keydown">{{text}}</div> 
            <div class="unit-group__header__type">G</div>
        </div>
        <div class="unit-group__items" :style="computedSize"></div>
        <div class="unit-group__connector-left"></div>
        <div class="unit-group__connector-right"></div>
    </div>
</template>

<script>
import Unit from '../Unit';

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


        /* For each Unit in the db  */
        this.loadItemsFromDB();

        this.handleEditLogic();
    },
    updated: function() {
        console.log(this.editmode);
    },
    methods: {
        /* Move unit */
        moveBy: function() { 
            
        },
        internalScaleTo: function(cx, cy, scaleBy) {
            this.scale *=scaleBy;
        },
        /* position attached lines */
        // updateLines() {
        //     let board = this.$parent;
        //     for (const lineId of this.lines) {
        //         if (board.$refs[lineId]) {
        //             board.$refs[lineId].updateLine();
        //         }
        //     }
        // },
        pushLine(lineId) {
            this.lines.push(lineId);
        },
        removeLine(lineId) {
            delete this.lines[this.lines.indexOf(lineId)];
        },
        /* Unit methods */
        getUnit: function() {
            return this.unit;
        },
        /* Drag & Drop methods  */
        onDragStart: function() {
            // Update global z-index and future values 
            this.$emit('unitdragstart');
        },
        onDrag: function (dx,dy) {

            this.containedUnits.forEach((unit) => {
                unit.left += dx;
                unit.top += dy;
            });
        },
        onDragEnd: function() {
            this.$emit('unitdragend');
        },
        onDelete: function () {
            let board = this.$parent;
            
            for (let index = 0; index < this.containedUnits.length; index++) {
                const unit = this.containedUnits[index];
                unit.groupContainer = null;
            }

            for (let i = 0; i < this.lines.length; i++) {
                const lineId = this.lines[i];
                const line = board.$refs[lineId];
                if (line) {
                    /* If line is from Relation , delete relation */
                    if (line.options.isRelationToUnit) {
                        line.src.onDelete();
                    }
                 } 
                board.deleteLineOnRuntime(lineId);
                
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
            let padding = 10*this.scale;
            let rightmostX = -99999, leftmostX = 99999;
            let upperboundY = 99999, lowerboundY = -99999;
            /* determine group element boundries */
            this.containedUnits.forEach(unit => {
                let unitRect = unit.$el.getBoundingClientRect();
                rightmostX = Math.max(rightmostX, unit.left + unitRect.width);
                leftmostX = Math.min(leftmostX, unit.left);
                upperboundY = Math.min(upperboundY, unit.top);
                lowerboundY = Math.max(lowerboundY, unit.top + unitRect.height);
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

            // this.updateLines();
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
                zIndex: this.zIndex-1000
            }
        },
        computedSize: function(){
            return {
                width: `${this.width}px`,
                height: `${this.height}px`,
                zIndex: this.zIndex-1000
            }
        },
        computedHeader: function() {
            console.log(this.zIndex);
            return {
                zIndex: `${this.zIndex}`,
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
        editmode: function(mode) {
            console.log(mode);
            if(mode) {
                /* Focus editable div */
                let input = this.$el.querySelector('.input');
                input.focus();
            } else {
                /* Blur editable div */
                this.$el.blur();
                this.isGhost = false;
            }

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
        border-color: rgba(255, 87, 51, .6);
        padding: 0;

        &__header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-weight: 900;
            padding: 10px;
            border-top: 2px solid rgba(255, 87, 51, .6);
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
                width: 30px;
                margin: auto;
                margin-left: 0;
                font-size: 17px;
                outline:solid black 1px;
                align-self: center;   
            }
        }

        &__items {
            order: 0;
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
        }
    }

</style>