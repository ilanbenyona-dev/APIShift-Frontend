<template>
    <div class="unit-relation" :style="transformation">
        <div class="unit-relation__header">
            <div class="unit-relation__header__text single-line input"
            :contenteditable="editmode"
            @keydown="keydown">{{text}}</div>                 
            <div class="unit-relation__header__type">R</div>
        </div>
        <div class="unit-relation__connector-left"></div>
        <div class="unit-relation__connector-top"></div>
        <div class="unit-relation__connector-right"></div>
        <div class="unit-relation__connector-bottom"></div>
    </div>
</template>

<script>
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

        /* Mount lines to Items */
        self.mountLines();


        // this.text = this.unit.getUID();

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
        onDelete() {
            let board = this.$parent;
            let srcUnit = board.$refs[this.unit.getSrcId()];
            let destUnit = board.$refs[this.unit.getDestId()];

            for (let i = 0; i < this.lines.length; i++) {
                const lineId = this.lines[i];
                const line = board.$refs[lineId];
                if (line) {
                    if (line.src.unit.getType() === "Relation") {
                        if (line.src.unit.getDestId() === this.unit.getUID()) {
                            line.src.onDelete();
                        }
                    }
                    if (line.dest.unit.getType() === "Relation") {
                        if (line.dest.unit.getSrcId() === this.unit.getUID()) {
                            line.dest.onDelete();
                        }
                    }
                    if (srcUnit === line.dest || srcUnit === line.src) {
                        srcUnit.removeLine(lineId);
                        board.deleteLineOnRuntime(lineId);
                    }
                    else if (destUnit === line.dest || destUnit === line.src) {
                        destUnit.removeLine(lineId);
                        board.deleteLineOnRuntime(lineId);
                    }
                }
            }
            // this.lines = [];
            if (this.groupContainer) {
                this.groupContainer.removeItem(this.unit.getUID())
            }
            board.deleteUnitOnRuntime(this.unit.getUID());
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
            let line1 = await this.$parent.drawLine(srcUnit, this, 
                {isUnitToRelation: true,
                  relationType: this.unit.getRelationType(),
                  isRelationToRelation,
                });
            let line2 = await this.$parent.drawLine(this, destUnit,
                {isRelationToUnit: true, 
                  relationType: this.unit.getRelationType(),
                  isRelationToRelation,
                });

            this.pushLine(line1);
            this.pushLine(line2);
            srcUnit.pushLine(line1);    
            destUnit.pushLine(line2);

            console.log(this.lines);
        },
        removeLine(lineId) {
            // const board = this.$parent;
            delete this.lines[this.lines.indexOf(lineId)];

            // if (this.lines.length) {
            //     board.deleteUnitOnRuntime(this.unit.getUID());
            // }
        },
    },
    props: {
        isBoardRendered: {
            type: Boolean
        }
    },
    watch: {
        isBoardRendered: function() {
            console.log('oiasjioasdioasdaosda\naoisdjoiasdiojasd\noijasdiuasdoiajsd\nsddassd');
            this.mountLines();
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

        &__connector {
            &-left {
                position: absolute;
                top: 50%;
                left: 0%;
            }
            &-top {
                position: absolute;
                top: 0%;
                left: 50%;
            }
            &-right {
                position: absolute;
                top: 50%;
                left: 100%;
            }
            &-bottom {
                position: absolute;
                top: 100%;
                left: 50%;
            }
        }
    }

</style>