<template>
  <div class="selection-box" :style="transformation">

  </div>
</template>

<script>
import { Helpers } from '../../assets/js/Helpers';

export default {
    mounted: function() {
        let self = this;
        let board = document.querySelector('#board');
        this.itemElements = [...board.querySelectorAll('.unit-item'),
                             ...board.querySelectorAll('.unit-relation'),
                             ...board.querySelectorAll('unit-point')]; 
        this.itemElements = this.itemElements.filter((item) => {
            if (self.$parent.$refs[item.ref].groupContainer === null) {
                return item;
            }
        });
    },
    data: function () {
        return {
            // Functional data
            pointerX: 0,
            pointerY: 0,
            itemElements: [],
            // UI data 
            top: 0,
            left: 0,
            height: 0,
            width: 0
        }
    },
    computed: {
        transformation() { 
            for (let i = 0; i < this.itemElements.length; i++) {
                const itemElement = this.itemElements[i];
                if (Helpers.hitTest(itemElement, this.$el, 1)) {
                    // !self.$parent.$refs[item.ref].groupContainer
                    itemElement.classList.add('selected');
                } else {
                    itemElement.classList.remove('selected');
                }
            }
            return {
                transform: `translate3d(${this.left}px,${this.top}px,0)`, // For GPU-accelerated transformation
                height: `${Math.abs(this.height)}px`,
                width: `${Math.abs(this.width)}px`
            }
        }
    },
    watch: {
        height: function (height) {
            if (height < 0) {
                this.top = this.pointerY + height;
            }
        },
        width: function (width) {
            if (width < 0) {
                this.left = this.pointerX + width;
            }
        },
        pointerX: function(pointerX) {
            this.left = pointerX;
        },
        pointerY: function(pointerY) {
            this.top = pointerY;
        }
    },

}
</script>

<style lang="scss" scoped>
    .selection-box {
        position: absolute;
        background: rgba(255, 0, 0,0.01);
        opacity: 0.5;
        border: 2px dashed red;
        z-index: 9999;
    }
</style>