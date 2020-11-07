<template>
    <div class="unit-type" 
    :style="transformation"
    :class="{'isghost':isGhost}">
        <div class="unit-type__header">
            <div class="unit-type__header__text single-line input"
            :contenteditable="editmode"
            @keydown="keydown">{{text}}</div>                
            <div class="unit-type__header__type">T</div>
        </div>
    </div>
</template>

<script>
import Unit from '../Unit.js'
import { Helpers } from '../../assets/js/Helpers';

export default {
    mixins: [Unit],
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

            /* Is the Element linked to Enum element in the Data level */
            let enumId = this.unit.getEnumContainerId();
            if(enumId !== null) {
                /* Get linked Enum vuejs instance */
                let enumUnit = this.$parent.$refs[enumId];
                /* Remove unit from contained element in the UI + Data level (internally) */
                enumUnit.removeUnitFromEnum(this.unit.getUID());

                /* Enum height/width has changed reposition lines */
                enumUnit.createPlaceHolders();
            }
            
            /* Change visibility if hidden */
            this.$el.style.opacity = 1; 
        },
        onDrag: function (dx,dy) {
            /* Move the element upwards */
            this.$el.style.zIndex = this.zIndex;

            /* Position element in the UI level */
            this.left += dx;
            this.top += dy;

            /* If hovering over Enum element highlight Enum element */
            let enumElements = document.querySelectorAll('.unit-enum');
            let i = enumElements.length;
            while (--i > -1) {
                if (Helpers.hitTest(this.$el, enumElements[i], .99)) {
                    enumElements[i].classList.add('highlight');
                    return;
                }
                else {
                    enumElements[i].classList.remove('highlight');
                }
            }
        },
        onDragEnd: function() {
            /* Is element over a Enum element */
            let enumElements = document.querySelectorAll('.unit-enum');
            let i = enumElements.length;
            while (--i > -1) {
                if (Helpers.hitTest(this.$el, enumElements[i], 0.99)) {
                    let ref = enumElements[i].ref;
                    let enumUnit = this.$parent.$refs[ref];

                    /* Append unit to Enum elememt */
                    enumUnit.addUnitToEnum(this.unit.getUID());
                    enumUnit.alignItems();
                    this.$el.classList.remove("selected");
                    return;
                }
            }

            this.$el.dispatchEvent(new Event('unitdragend'));
        },
        onDelete() {
            let board = this.$parent;
            board.deleteUnitOnRuntime(this.$el.ref);
        },
        setEnumContainerId: function (enumId) {
            this.unit.setEnumContainerId(enumId);
        },
  
    }

}
</script>

<style lang="scss">
    .unit-type {
        display: flex;
        flex-direction: column;
        border-color: rgb(0, 0, 0);

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
    }

</style>