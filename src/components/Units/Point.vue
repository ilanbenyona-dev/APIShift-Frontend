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
    mounted: function() {   
        console.log(this.$el);
        /* Position element */
        this.left = this.unit.xpos();
        this.top = this.unit.ypos();

        console.log(this.unit, this.unit.ypos());
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
            let itemElements = [...document.querySelectorAll('.unit-info'),
                                ...document.querySelectorAll('.unit-relation'),
                                ...document.querySelectorAll('.unit-group')]
            let i = itemElements.length;
            while (--i > -1) {
                if (Helpers.hitTest(itemElements[i], this.$el, 1)) {
                    console.log(this.lines[0]);
                    /* get targeted Info element */
                    let itemId = itemElements[i].ref;
                    let lineId = this.lines[0];              
                    var line = board.lines.find((l)=> l.id === lineId), relation;

                    if (line.options.isUnitToRelation) {
                        relation = line.dest;
                        relation.changeSrcOnRuntime(itemId);
                    } else if (line.options.isRelationToUnit) {
                        relation = line.src;
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