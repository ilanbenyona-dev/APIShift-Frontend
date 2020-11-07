<template>
    <div class="unit-info" :style="transformation">
        <div class="unit-info__header">
            <div class="unit-info__header__text single-line input"
            :contenteditable="editmode"
            @keydown="keydown">
                {{text}}
            </div>  
            <div class="unit-info__header__type">I</div>
        </div>
        <div class="unit-info__connector-left"></div>
        <div class="unit-info__connector-right"></div>
        <div class="unit-info__connector-enum"></div>
    </div>
</template>

<script>
/*
* Calculates the angle between AB and the X axis
* A and B are points (ax,ay) and (bx,by)
*/
// function getAngleDeg(ax,ay,bx,by) {
//     var angleRad = Math.atan((ay-by)/(ax-bx));
//     var angleDeg = angleRad * 180 / Math.PI;
    
//     return(angleDeg);
// }

import Unit from '../Unit.js'

export default {
    mixins: [Unit],
    mounted: function() {
        /* Position element as saved in DB */
        this.left = this.unit.xpos();
        this.top = this.unit.ypos();

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

            /* If we are during a relation linkage process */
            if (document.body.style.cursor === 'cell') {
                document.body.style.cursor = 'default';
                this.$parent.createRelation(null, this.unit.getUID());           
            }
        },
        onDrag: function (dx,dy) {
            /* Position element in the UI level */
            this.left += dx;
            this.top += dy;
        },
        onDragEnd: function() {
            this.$el.dispatchEvent(new Event('unitdragend'));
        },
        onDelete: function () {
            let board = this.$parent;
            
            for (let i = 0; i < this.lines.length; i++) {
                const lineId = this.lines[i];
                const line = board.$refs[lineId];
                if (line) {
                    /* If line is from Relation , delete relation */
                    if (line.options.isRelationToUnit) {
                        line.src.onDelete();
                    }
                    /* If line is to Relation , delete relation */
                    else if (line.options.isUnitToRelation) {
                        line.dest.onDelete();
                    }
                 } 
                board.deleteLineOnRuntime(lineId);
            }

            if (this.groupContainer) {
                this.groupContainer.removeItem(this.unit.getUID())
            }

            board.deleteUnitOnRuntime(this.$el.ref);
        },
        getEnumId: function() {
            return this.unit.getEnumId();
        },
        setEnumId: function(enumId) {
            this.unit.setEnumId(enumId);
        },
        async drawLineToEnum(enumId) {
            // /* Target enum element and line options */
            let enumUnit = this.$parent.$refs[enumId];
            let line = await this.$parent.drawLine(this, enumUnit, { isInfoToEnum: true });

            console.log(line);
            /* update coponents lines */
            this.pushLine(line);
            enumUnit.pushLine(line);
        },
        removeLineToEnum() {
            this.setEnumId(null)
        },
        mountLines() {
            /* Mount line with Enum if exists */
            let enumId = this.unit.getEnumId();
            if (enumId) {
                this.drawLineToEnum(enumId);
            }
        },
        removeLine(lineId) {
            delete this.lines[this.lines.indexOf(lineId)];
        },
    },

}
</script>

<style lang="scss" scoped>
    .unit-info {
        display: flex;
        flex-direction: column;
        border-color: rgb(66, 178, 253); 

        &__header {
            display: flex;
            justify-content: space-between;
            font-weight: 900;

            &__text {
                order: 1;
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

        &__connector {
            &-enum {
                position: absolute;
                top: 50%;
                left: 50%;
            }
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