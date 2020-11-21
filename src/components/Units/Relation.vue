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
        </div>
    </div>
</template>

<script>
import { Point } from '../../assets/js/unit-classes.js';
import Unit from '../Unit.js'

export default {
    mixins: [Unit],
    mounted: function() {
        let self = this;

        /* Calculate initial position */
        let initialX, initialY;
        if (self.unit.xpos() === 0 && self.unit.ypos() === 0) {
            /* Calculate initial position by averagein X/Y of connected units */
            let srcInfo = self.$parent.$refs[self.unit.getSrcId()];
            let destInfo = self.$parent.$refs[self.unit.getDestId()];

            console.log(self.unit.getSrcId());
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
    },
    methods: {
        /* Drag & Drop methods  */
        onDragStart: function() {
            /* Update global z-index and future values */
            this.$el.dispatchEvent(new Event('unitdragstart'));

            /* Move the element upwards */
            this.$el.style.zIndex = this.zIndex;
        },
        onDrag: function (dx,dy) {
            /* Position element in the UI level */
            this.left += dx;
            this.top += dy;
        },
        onDragEnd: function() {
            this.$el.dispatchEvent(new Event('unitdragend'));
        },
        async onDelete() {
            let board = this.$parent;
            // let srcUnit = board.$refs[this.unit.getSrcId()];
            // let destUnit = board.$refs[this.unit.getDestId()];

            // for (let i = 0; i < this.lines.length; i++) {
            //     const lineId = this.lines[i];
            //     const line = board.$refs[lineId];
            //     if (line) {
            //         if (line.src.unit.getType() === "Relation") {
            //             if (line.src.unit.getDestId() === this.unit.getUID()) {
            //                 line.src.onDelete();
            //             }
            //         }
            //         if (line.dest.unit.getType() === "Relation") {
            //             if (line.dest.unit.getSrcId() === this.unit.getUID()) {
            //                 line.dest.onDelete();
            //             }
            //         }
            //         if (srcUnit === line.dest || srcUnit === line.src) {
            //             srcUnit.removeLine(lineId);
            //             board.deleteLineOnRuntime(lineId);
            //         }
            //         else if (destUnit === line.dest || destUnit === line.src) {
            //             destUnit.removeLine(lineId);
            //             board.deleteLineOnRuntime(lineId);
            //         }
            //     }

            this.lines.forEach(async (lineId) => {
                let line = board.$refs[lineId];
                let x,y, point, elRect = this.$el.getBoundingClientRect();

                /* Detach connected relations upon deletion */
                if (line.src.unit.getType() === "Relation" || line.dest.unit.getType() === "Relation") {
                    x = this.left + elRect.width/2 - 5*this.scale;
                    y = this.top + elRect.height/2 - 5*this.scale;
                    point = new Point(x,y,this.unit.getType());
                    console.log('asad');
                }

                if (line.src.unit.getType() === "Relation") {
                    if (line.src.unit.getDestId() === this.unit.getUID()) {
                        x = this.left + elRect.width/2 - 5*this.scale;
                        y = this.top + elRect.height/2 - 5*this.scale;
                        point = new Point(x,y,this.unit.getType());
                        await board.addUnitOnRuntime(point);
                        line.src.changeDestOnRuntime(point.getUID());
                    } else {
                        board.deleteLineOnRuntime(lineId);
                    }
                }
                else if (line.dest.unit.getType() === "Relation") {
                    if (line.dest.unit.getSrcId() === this.unit.getUID()) {
                        x = this.left + elRect.width/2 - 5*this.scale;
                        y = this.top + elRect.height/2 - 5*this.scale;
                        point = new Point(x,y,this.unit.getType());
                        await board.addUnitOnRuntime(point);
                        line.dest.changeSrcOnRuntime(point.getUID());
                    } else {
                        board.deleteLineOnRuntime(lineId);
                    }
                }
                board.deleteLineOnRuntime(lineId);
            });


        },
        async mountLines() {
            console.log(this);
            let srcUnit = this.$parent.$refs[this.unit.getSrcId()];
            let destUnit = this.$parent.$refs[this.unit.getDestId()];
            if (!srcUnit || !destUnit) {
                // this.$parent.deleteUnitOnRuntime(this.unit.getUID());
                return;
            }

            
            const isRelationToRelation = srcUnit.unit.getType() === destUnit.unit.getType() && destUnit.unit.getType() === "Relation";
            await this.$parent.addLineOnRuntime(this.unit.getSrcId(), this.unit.getUID(), 
                {isUnitToRelation: true,
                  relationType: this.unit.getRelationType(),
                  isRelationToRelation,
                });
            if (isRelationToRelation) {
                this.$el.querySelector('.connector-top').classList.add('active');            
            } else {
                this.$el.querySelector('.connector-left').classList.add('active');            
            }

            await this.$parent.addLineOnRuntime(this.unit.getUID(), this.unit.getDestId(),
                {isRelationToUnit: true, 
                  relationType: this.unit.getRelationType(),
                  isRelationToRelation,
                });
            if (isRelationToRelation) {
                this.$el.querySelector('.connector-bottom').classList.add('active');            
            } else {
                this.$el.querySelector('.connector-right').classList.add('active');            
            }

            console.log(this.$parent.lines);
            // this.pushLine(line1);
            // this.pushLine(line2);
            // srcUnit.pushLine(line1);    
            // destUnit.pushLine(line2);

            console.log(this.lines);
        },
        removeLine(lineId) {

            this.lines = this.lines.filter((l) => {
                if (l !== lineId) {
                    console.log(l);
                    return l;
                }
            });

            // if (this.lines.length === 0) {
            //     let board = this.$parent;
            //     if (this.groupContainer) {
            //         this.groupContainer.removeItem(this.unit.getUID())
            //     }
            //     board.deleteUnitOnRuntime(this.unit.getUID());     
            // }
        },
        async changeDestOnRuntime(newDest) {
            const board = this.$parent;
            const lineSrc = this.unit.getUID();
            const lineDest = this.unit.getDestId();

            /* If line already connected to point - delete it */
            if (board.$refs[lineDest].unit.getType() === "Point") {
                board.$refs[lineDest].onDelete();
            }

            /* Ordering the Id's and producing the same uid for any combinations of order */
            let lineId = '';
            if (lineSrc > lineDest) {
                lineId += lineDest;
                lineId += lineSrc;
            } else {
                lineId += lineSrc;
                lineId += lineDest;
            }

            /* Change relation dest on UI level (view) */
            await board.deleteLineOnRuntime(lineId);
            await board.addLineOnRuntime(this.unit.getUID(), newDest, {
                isRelationToUnit: true, 
                relationType: this.unit.getRelationType(),
            });
            
            /* Change relation dest on Data level (model) */
            this.unit.setDestId(newDest);
        },
        async changeSrcOnRuntime(newSrc) {
            const board = this.$parent;
            const lineDest = this.unit.getUID();
            const lineSrc = this.unit.getSrcId();

            /* If line already connected to point - delete it */
            if (board.$refs[lineSrc].unit.getType() === "Point") {
                board.$refs[lineSrc].onDelete();
            }

            /* Ordering the Id's and producing the same uid for any combinations of order */
            let lineId = '';
            if (lineSrc > lineDest) {
                lineId += lineDest;
                lineId += lineSrc;
            } else {
                lineId += lineSrc;
                lineId += lineDest;
            }

            /* Change relation dest on UI level (view) */
            await board.deleteLineOnRuntime(lineId);
            await board.addLineOnRuntime(newSrc, this.unit.getUID(), {
                isUnitToRelation: true, 
                relationType: this.unit.getRelationType(),
            });

            
            /* Change relation dest on Data level (model) */
            this.unit.setSrcId(newSrc);
        },
        setSrcId(srcId) {
            this.unit.setSrcId(srcId);
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
            console.log(`${this.unit.getUID()} has ${this.lines} \n with length of ${this.lines.length}`);

        },
        lines: function(lines) {
            if (lines.length === 0) {
                let board = this.$parent;
                if (this.groupContainer) {
                    this.groupContainer.removeItem(this.unit.getUID())
                }
                board.deleteUnitOnRuntime(this.unit.getUID());     
            }
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
        }
    }

</style>