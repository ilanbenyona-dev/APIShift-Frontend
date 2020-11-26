<template>
    <div class="unit-relation" :style="transformation">
        <div class="unit-relation__header">
            <div class="unit-relation__header__text single-line input"
            :contenteditable="editmode"
            @keydown="keydown">{{unit.getUID()}}</div>                 
            <div class="unit-relation__header__type">R</div>
        </div>
        <div class="connector">
            <div class="connector-left"></div>
            <div class="connector-top"></div>
            <div class="connector-right"></div>
            <div class="connector-bottom"></div>
            <div class="connector-enum"></div>
        </div>
    </div>
</template>

<script>
import { Point } from '../../assets/js/unit-classes.js';
import Unit from '../Unit.js'

export default {
    mixins: [Unit],
    data() {
        return {
            /* Line settings determined on runtime */
            settings: {
                isRelationToRelation: false,
                isItemToItem: false
            }
        }
    },
    mounted: function() {
        let self = this;

        /* Calculate initial position */
        let initialX, initialY;
        if (self.unit.xpos() === 0 && self.unit.ypos() === 0) {
            /* Calculate initial position by averagein X/Y of connected units */
            let srcInfo = self.$parent.$refs[self.unit.getSrcId()];
            let destInfo = self.$parent.$refs[self.unit.getDestId()];


            initialX = (srcInfo.left + destInfo.left) / 2;
            initialY = (srcInfo.top + destInfo.top) / 2;   
        }
        else {
            /* Position from latest saved instance */
            initialX = self.unit.xpos();
            initialY = self.unit.ypos();
        }
        
        /* Set element position on UI */
        self.left = initialX;
        self.top = initialY; 

        /* Render lines upon mountation */
        this.mountLines();

        /* Set edit functionality */
        this.handleEditLogic();

        this.calculateSettings();

        // let updateOften = function() {
        //     self.calculateSettings();
        //     requestAnimationFrame(updateOften);
        // }
        // updateOften();
    },
    methods: {
        /* Drag & Drop methods  */
        onDragStart: function() {
            /* Update global z-index and future values */
            this.$el.dispatchEvent(new Event('unitdragstart'));

            /* Move the element upwards */
            this.$el.style.zIndex = this.zIndex;

            if (this.groupContainer) { 
                this.$el.style.zIndex -= 500;
            }
        },
        onDrag: function (dx,dy) {
            // var board = this.$parent;

            /* Position element in the UI level */
            this.moveBy(dx,dy);

            /* Optional - move points attached */
            // this.lines.forEach((lineId) => {
            //     let line = board.lines.find((l)=> l.id === lineId);
            //     console.log(line);

            //     if (line.src.unit.getType() === "Point") {
            //         line.src.moveBy(dx,dy);
            //     }
            //     if (line.dest.unit.getType() === "Point") {
            //         line.dest.moveBy(dx,dy);
            //     }
            // })
        },
        onDragEnd: function() {
            this.$el.dispatchEvent(new Event('unitdragend'));
        },
        async onDelete() {
            let board = this.$parent;
            var x,y,point, elRect = this.$el.getBoundingClientRect();


            
            for (const lineId of this.lines) {
                let line = board.$refs[lineId];
                // let lineSrc = line.src;
                // let lineDest = line.dest;

                x = this.left + elRect.width/2 - 5*this.scale;
                y = this.top + elRect.height/2 - 5*this.scale;
                point = new Point(x,y,this.unit.getType());

                console.log('Line src ', line.src.unit.getUID());
                console.log('Line dest ', line.dest.unit.getUID());


                // let relation = lineSrc.unit.getType() === "Relation" && lineSrc.unit.getUID() !== this.unit.getUID() ? lineSrc :
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
                    if (line.dest.unit.getSrcId() === this.unit.getUID() ||
                        line.src.unit.getDestId() === this.unit.getUID()) {
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
                
                // board.deleteLineOnRuntime(lineId);
            }


        },
        async mountLines() {
            let srcUnit = this.$parent.$refs[this.unit.getSrcId()];
            let destUnit = this.$parent.$refs[this.unit.getDestId()];
            if (!srcUnit || !destUnit) {
                // this.$parent.deleteUnitOnRuntime(this.unit.getUID());
                return;
            }

            if (this.lines.length >= 2) {
                return;
            }

            var isRelationToRelation = this.settings.isRelationToRelation;
            // if (srcUnit.unit._prevType === 'Relation') {
            //     isRelationToRelation = 'Relation' === (destUnit.unit._prevType || destUnit.unit.getType())
            // } else if (destUnit.unit._prevType === 'Relation') {
            //     isRelationToRelation = 'Relation' === (srcUnit.unit._prevType || srcUnit.unit.getType())
            // }
            const isReverse = srcUnit === destUnit;

            await this.$parent.addLineOnRuntime(this.unit.getSrcId(), this.unit.getUID(), 
                {isUnitToRelation: true,
                  relationType: this.unit.getRelationType(),
                  isRelationToRelation,
                  isReverse
                });
            // if (isRelationToRelation) {
            //     this.$el.querySelector('.connector-top').classList.add('active');            
            // } else {
            //     this.$el.querySelector('.connector-left').classList.add('active');            
            // }

            await this.$parent.addLineOnRuntime(this.unit.getUID(), this.unit.getDestId(),
                {isRelationToUnit: true, 
                  relationType: this.unit.getRelationType(),
                  isRelationToRelation,
                  isReverse
                });
            this.$forceUpdate();
        },
        async changeDestOnRuntime(newDestId) {
            const board = this.$parent;
            const destItem = board.$refs[this.unit.getDestId()];
            
            if (!destItem) {
                return;
            }
            /* If line already connected to point - delete it */
            if (destItem.unit.getType() === "Point") {
                destItem.onDelete();
            }

            /* Find the line to dest item */
            let lineId = this.lines.find((l) => destItem.lines.includes(l));


            /* Change relation dest on UI level (view) */
            await board.deleteLineOnRuntime(lineId);
            await board.addLineOnRuntime(this.unit.getUID(), newDestId, {
                isRelationToUnit: true, 
                relationType: this.unit.getRelationType(),
                // isRelationToRelation: this.settings.isRelationToRelation//this.unit.getType() === newDest.unit.getType() || newDest.unit._prevType === "Relation"
            });
            
            /* Change relation dest on Data level (model) */
            this.unit.setDestId(newDestId);

            this.calculateSettings();
        },
        async changeSrcOnRuntime(newSrcId) {
            const board = this.$parent;
            const srcItem = board.$refs[this.unit.getSrcId()];
            // const newSrc = board.$refs[newSrcId];

            // const isRelationToRelation = this.unit.getType() === newSrc.unit.getType() || newSrc.unit._prevType === "Relation";

            /* If line already connected to point - delete it */
            if (srcItem.unit.getType() === "Point") {
                srcItem.onDelete();
            }

            /* Find the line to dest item */
            let lineId = this.lines.find((l) => srcItem.lines.includes(l));

            /* Change relation dest on UI level (view) */
            await board.deleteLineOnRuntime(lineId);
            await board.addLineOnRuntime(newSrcId, this.unit.getUID(), {
                isUnitToRelation: true, 
                relationType: this.unit.getRelationType(),
                // isRelationToRelation: this.settings.isRelationToRelation// this.unit.getType() === newSrc.unit.getType() || newSrc.unit._prevType === "Relation"
            });

            
            /* Change relation dest on Data level (model) */
            this.unit.setSrcId(newSrcId);

            this.calculateSettings();
        },
        calculateSettings() {
            let board = this.$parent;
            let srcItem = board.$refs[this.unit.getSrcId()];
            let destItem = board.$refs[this.unit.getDestId()];
            
            if (!srcItem || !destItem || this.lines.length < 2) {
                return;
            }
            let srcType = (srcItem.unit._prevType || srcItem.unit.getType());
            let destType = (destItem.unit._prevType || destItem.unit.getType());
            this.settings = {isRelationToRelation: false, isItemToItem: false};
            
            /* Find the lines to item */
            let lineSrcId = this.lines.find((l) => srcItem.lines.includes(l)); 
            let lineDestId = this.lines.find((l) => destItem.lines.includes(l));

            if (!lineSrcId || !lineDestId) {
                return;
            }
            let lineSrc = board.$refs[lineSrcId];
            let lineDest = board.$refs[lineDestId];



            if (this.unit.getUID() === "6djsbh") {
                console.log(this.unit.getUID(),srcType, destType);
            }
    
            if (srcType === "Relation" && srcType === destType && destItem != srcItem) {
                this.settings['isRelationToRelation'] = true;
                lineSrc.options.isRelationToRelation = true;
                lineDest.options.isRelationToRelation = true;
                
            } else {
                this.settings['isItemToItem'] = true;
                lineSrc.options.isRelationToRelation = false;
                lineDest.options.isRelationToRelation = false;
            }

            this.$el.querySelector('.connector-bottom').classList.remove('active');
            this.$el.querySelector('.connector-top').classList.remove('active');
            this.$el.querySelector('.connector-right').classList.remove('active');
            this.$el.querySelector('.connector-left').classList.remove('active');

            if (this.settings.isRelationToRelation) {
                this.$el.querySelector('.connector-top').classList.add('active');
                this.$el.querySelector('.connector-bottom').classList.add('active');
            } else if (this.settings.isItemToItem) {
                this.$el.querySelector('.connector-right').classList.add('active');
                this.$el.querySelector('.connector-left').classList.add('active');
            }
        }
    },
    props: {
        isBoardRendered: {
            type: Boolean
        }
    },
    watch: {
        isBoardRendered: function() {
            /* Render lines upon initial renderation */
            this.mountLines();
        },  
        lines: {
            // immediate: true,
            handler(lines) {
                let board = this.$parent;
                let srcItem = board.$refs[this.unit.getSrcId()];
                let destItem = board.$refs[this.unit.getDestId()];

                
                this.calculateSettings();                
                if (lines.length === 0 || (!srcItem && !destItem)) {
                    if (this.groupContainer) {
                        this.groupContainer.removeItem(this.unit.getUID())
                    }
                    board.deleteUnitOnRuntime(this.unit.getUID());   
                }

            },
            deep: true
        }

    }

}
</script>

<style lang="scss" scoped>
    .unit-relation {
        display: flex;
        flex-direction: column;
        border-color: rgb(0, 200, 0);

        &__header {
            display: flex;
            // justify-content: space-between;
            min-width: 40px;
            padding: 1px;
            left: 0;
            font-weight: 900;
            &__text {
                order: 1;
                white-space: nowrap;
                margin: 0; 
                margin-left: 10px; 
                padding-left: 2px;
                padding-right: 2px;
                border: none; 
                & > * {
                    display: none;
                }
                &  * {
                    display: none;
                }
            }
            &__type {
                display: flex;
                justify-content: center;
                align-items: center;
                order: 0;
                border-radius: 100%;
                color: black;
                text-align: center;
                height: 20px;
                width: 20px;
                margin: auto;
                margin-left: 0;
                outline:solid black 1px;
            }
        }

        .connector {
            cursor: pointer;
            &-left {
                position: absolute;
                top: 50%;
                left: 0%;
                        border-radius: 1000px;

                &.active {
                    content: '';
                    top: 15px;
                    left: -10px;
                    height: 15px;
                    width: 15px;
                    background:rgba(0, 200, 0, 0.95);
                    //   border-radius: 50px 20px;

                }
                // translate: transform2d(1000%, 0);
            }
            &-top {
                position: absolute;
                top: 0%;
                left: 50%;
                border-radius: 1000px;

                &.active { 
                    content: '';
                    height: 15px;
                    width: 15px;
                    left: calc(50% - 7.5px);
                    top: -10px;
                    background:rgba(0, 200, 0, 0.95);

                }
            }
            &-right {
                position: absolute;
                top: 50%;
                left: 100%;
                border-radius: 1000px;

                &.active { 
                    content: '';
                    height: 15px;
                    width: 15px;
                    left: calc(100% - 5px);
                    top: 15px;
                    background:rgba(0, 200, 0, 0.95);
                }
            }
            &-bottom {
                position: absolute;
                bottom: -10px;
                left: 50%;
                border-radius: 1000px;

                &.active { 
                    content: '';
                    height: 15px;
                    width: 15px;
                    left: calc(50% - 7.5px);
                    background:rgba(0, 200, 0, 0.95);
                }
            }
            &-enum {
                position: absolute;
                top: 50%;
                left: 50%;
            }
        }
    }

</style>