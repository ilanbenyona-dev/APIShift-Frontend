<template>
    <div class="unit-point" 
    :style="transformation">
            <div class="connector">
            <div class="connector-left"></div>
            <div class="connector-top"></div>
            <div class="connector-right"></div>
            <div class="connector-bottom"></div>
        </div>
    </div>
</template>

<script>
import Unit from '../Unit.js'
import { Helpers } from '../../assets/js/Helpers';

export default {
    mixins: [Unit],
    data() {
        return {
            relation: null
        }
    },
    mounted: function() {   
        /* Position element */
        this.left = this.unit.xpos();
        this.top = this.unit.ypos();

        /* Positon element lines */
        this.updateLines();

        /* Set edit functionality */
        this.handleEditLogic();
    },
    methods: {
        /* Drag & Drop methods  */
        onDragStart: function() {
            /* Update global z-index and future values */
            this.$el.dispatchEvent(new Event('unitdragstart'));

        },
        onDrag: function (dx,dy) {
            /* Move the element upwards */
            this.$el.style.zIndex = this.zIndex;

            /* Position element in the UI level */
            this.left += dx;
            this.top += dy;
        },
        onDragEnd: function() {
            let board = this.$parent;
            this.$el.dispatchEvent(new Event('unitdragend'));

            
            /* If the Point drops on Item, link relation to the Item */
            let itemElements = [...document.querySelectorAll('.unit-group'),
                                ...document.querySelectorAll('.unit-info'),
                                ...document.querySelectorAll('.unit-relation')];
            let i = itemElements.length;
            while (--i > -1) {
                if (Helpers.hitTest(itemElements[i], this.$el, 1)) {
                    /* get targeted Info element */
                    let itemId = itemElements[i].closest('.unit').ref;
                    let lineId = this.lines[0]; 
                    var line = board.lines.find((l)=> l.id === lineId), relation;

                    /* If Point drops on owning Relation */
                    if (itemElements[i] === line.src.$el.closest('.unit') || itemElements[i] === line.dest.$el.closest('.unit')) {
                        return;
                    }


                    if (!board.$refs[itemId]) {
                        return;
                    }
                    if (line.options.isUnitToRelation) {
                        relation = line.dest;
                        if (relation.groupContainer !== board.$refs[itemId].groupContainer) {
                            return;
                        }
                        relation.changeSrcOnRuntime(itemId);
                    } if (line.options.isRelationToUnit) {
                        relation = line.src;
                        if (relation.groupContainer !== board.$refs[itemId].groupContainer) {
                            return;
                        }
                        relation.changeDestOnRuntime(itemId);
                    }
                    return;
                }
            }
        },
        onDelete() {
            let board = this.$parent;
            board.deleteUnitOnRuntime(this.$el.ref);
        },

    },
    watch: {
        lines: {
            handler: function(lines){
                let board = this.$parent;
                if (lines.length === 1) {
                    let line = board.$refs[lines[0]];
                    if (line.src.unit.getType() === "Relation") {
                        this.relation = line.src;
                    } 
                    if (line.dest.unit.getType() === "Relation") {
                        this.relation = line.dest;
                    }
                    console.log(this.relation);
                }
                if (lines.length === 0) {
                    let board = this.$parent;
                    if (this.groupContainer) {
                        this.groupContainer.removeItem(this.unit.getUID())
                    }
                    board.deleteUnitOnRuntime(this.unit.getUID());     
                }
            },
            deep: true
        }

    },
    computed: {
        transformation () {
            return {
                transform: `translate3d(${this.left}px,${this.top}px, 0) scale(${this.scale})`,
                zIndex: 998
            }
        }
    }

}
</script>

<style lang="scss">
    .unit-point {
        width: 1px;
        height: 1px;
        background: black;
        opacity: .5;
    }
    .connector {
        // position: absolute;
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

</style>