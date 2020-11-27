<template>
    <div class="unit-enum"
    :style="transformation"
    :class="{'isghost':isGhost}">
        <div class="unit-enum__header">
            <div class="unit-enum__header__text single-line input"
            :contenteditable="editmode"
            @keydown="keydown">{{unit.getText()}}</div>   
            <div class="unit-enum__header__type">E</div>
        </div>
        <div class="unit-enum__items"></div>
    </div>
</template>

<script>
import Unit from '../Unit.js'
import { Helpers } from '../../assets/js/Helpers';

export default {
    mixins: [Unit],
    data: function() {
        return {
            // Controller data 
            originalTop: 0,
            originalLeft: 0,
            containedTypes: [],
            linkedItem: null,
        }
    },
    mounted: function() {
        /* Position element */
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

            /* Save initial drag position for future calculations */
            this.originalLeft = this.left;
            this.originalTop = this.top;
                
            this.createPlaceHolders();
        },
        onDrag: function (dx,dy) {
            /* Move elements */
            this.moveBy(dx,dy);

            /* Align contained items */
            this.alignItems();
            
             if (this.unit.getItemId()) return;

            /* If the element over Info element, link Info element */
            let itemElements = [...document.querySelectorAll('.unit-item'),
                                    ...document.querySelectorAll('.unit-relation'),
                                    ...document.querySelectorAll('.unit-group')];
            let i = itemElements.length;
            let itemHitted = false;
            while (--i > -1) {
                itemHitted = Helpers.hitTest(itemElements[i], this.$el, 1)
                if (itemHitted) {
                    this.$el.classList.add('highlight');
                    return;
                }
            }
            if (!itemHitted) this.$el.classList.remove('highlight');
        },
        onDragEnd: async function() {
            
            // Handle dragend event on parent board
            this.$el.dispatchEvent(new Event('unitdragend'));
            this.alignItems();

            if (this.unit.getItemId()) return;

            /* If the element over Info element, link Info element */
            let itemElements = [...document.querySelectorAll('.unit-item'),
                                ...document.querySelectorAll('.unit-relation'),
                                ...document.querySelectorAll('.unit-group')];
            let i = itemElements.length;
            while (--i > -1) {
                if (Helpers.hitTest(itemElements[i], this.$el, 1)) {
                    /* get targeted Item element */
                    let itemId = itemElements[i].ref
                    
                    /* Move Enum to original position on UI level */
                    this.moveTo(this.originalLeft,this.originalTop);

                    /* Align contained Types */
                    this.alignItems();

                    /* Link Item with Enum on Data level (model) */
                    this.unit.setItemId(itemId);

                    /* Link Item with Enum on UI level (view) */
                    await this.mountLines();
                    return;
                }
                this.$el.classList.remove('highlight');
            }
        
        },
        async onDelete() {
            let board = this.$parent;

            /* Delete connected lines and remove Enum from screen */       
            for (const lineId of this.lines) {
                await board.deleteLineOnRuntime(lineId);
            }
            
            /* Delete contained Types on Enum */
            let containedTypes = this.unit.getContainedUnits();
            for (const unitId of containedTypes) {
                let unit = board.$refs[unitId];
                await unit.onDelete();
            }

            await board.deleteUnitOnRuntime(this.$el.ref);
        },
        /* Unit methods */
        removeUnitFromEnum(unitId) {
            // Targeted unit is usually Type - TODO: Ask sapir 
            let targetedUnit = this.$parent.$refs[unitId];
            targetedUnit.setEnumContainerId(null);
            this.unit.removeUnitFromEnum(unitId);
            this.alignItems();

            this.$el.classList.remove('highlight');
        },
        addUnitToEnum(unitId) {
            // Assign targeted unit's enum container to this Enum container id
            let targetedUnit = this.$parent.$refs[unitId];
            // Establish relationship between the Enum and the added Unit on the Data level
            targetedUnit.setEnumContainerId(this.unit.getUID());
            this.unit.addUnitToEnum(unitId);
            // Align and move element according to the relationship on UI level
            this.createPlaceHolders();
            this.alignItems();

            this.$el.classList.remove('highlight');
        },
        alignItems() {
            let self = this;
            // let placeholders = self.$el.querySelectorAll('.placeholder');
            // add place holders and position every contained element inside

            this.unit.getContainedUnits().forEach((unitId, index) => {
                let unit = self.$parent.$refs[unitId];
                /* Allign unit's z-index accordingly to container */
                unit.$el.style.zIndex = self.zIndex + 1;

                unit.left = self.left + self.$el.getBoundingClientRect().width/2 - unit.$el.getBoundingClientRect().width/2;
                unit.top = 15*self.scale + self.$el.querySelector('.unit-enum__header').getBoundingClientRect().bottom + (index * unit.$el.getBoundingClientRect().height);
            });

            this.updateLines();
        },
        createPlaceHolders() {
            let self = this;

            /* remove all placeholders */
            this.$el.querySelector('.unit-enum__items').innerHTML = '';

            /* Create placeholder for Types contained */
            this.unit.getContainedUnits().forEach((unitId) => {
                let unit = self.$parent.$refs[unitId];

                /* Create placeholder element */
                let placeholder = document.createElement('div');
                placeholder.classList.add('unit');
                placeholder.classList.add('unit-type');
                placeholder.classList.add('placeholder')
                /* Deep-copy child nodes */
                unit.$el.childNodes.forEach(function(item) {
                    var cln = item.cloneNode(true);
                    placeholder.appendChild(cln);
                });
                /* Change originial unit visibility */
                unit.$el.style.opacity = '0';    
                
                /* Append it to Enum */
                self.$el.querySelector('.unit-enum__items').appendChild(placeholder);
            });
        },
        async mountLines() {
            let board = this.$parent;

            /* Mount line with Enum if exists */
            let itemId = this.unit.getItemId();
            if (itemId) {
                await board.addLineOnRuntime(itemId, this.unit.getUID(), 
                    { isInfoToEnum: true }
                );
            }
        },
    },
    props: {
        isBoardRendered: {
            type: Boolean
        }
    },
    watch: {
        isBoardRendered: function() {
                this.createPlaceHolders();
                this.alignItems();
                console.log('asdasd');
        }
    },
}
</script>

<style lang="scss" scoped>
    .unit-enum {
        display: flex;
        flex-direction: column;
        border-color: rgb(176, 179, 0); 

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
        &__items {
            position: relative;
            width: 100%;
            min-height: 30px;
            border-style: dotted;
            border-width: .5%;
            padding-left: 10px;
            padding-right: 10px;
            margin-top: 10px;
            
            & .unit {
                position: relative !important;
            }
        }

        &.highlight {
            border-color: rgb(120, 122, 7);
        }
    }

</style>