<template>
    <div class="unit-enum"
    :style="transformation"
    :class="{'isghost':isGhost}">
        <div class="unit-enum__header">
            <div class="unit-enum__header__text single-line input"
            :contenteditable="editmode"
            @keydown="keydown">{{text}}</div>   
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
        // let self = this;

        /* Position element */
        this.left = this.unit.xpos();
        this.top = this.unit.ypos();

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
            this.left += dx;
            this.top += dy;

            /* Align contained items */
            this.alignItems();

            /* If the element over Info element, highlight, else remove  */
            let infoElements = document.querySelectorAll('.unit-info');
            let i = infoElements.length;
            let infoHitted = false;
            while (--i > -1) {
                infoHitted = Helpers.hitTest(infoElements[i], this.$el, 1)
                if (infoHitted) {
                    this.$el.classList.add('highlight');
                    return;
                }
            }
            if (!infoHitted) this.$el.classList.remove('highlight');
        },
        onDragEnd: async function() {
            
            // Handle dragend event on parent board
            this.$el.dispatchEvent(new Event('unitdragend'));

            // if (this.linkedItem) {
                
            // }
            /* If the element over Info element, link Info element */
            let infoElements = [...document.querySelectorAll('.unit-info'),]
                                //...document.querySelectorAll('.unit-relation'),]
                                // ...document.querySelectorAll('.unit-group')];
            let i = infoElements.length;
            while (--i > -1) {
                if (Helpers.hitTest(infoElements[i], this.$el, 1)) {
                    /* get targeted Item element */
                    let itemId = infoElements[i].ref
                    let targetedItem = this.$parent.$refs[itemId];
                    
                    /* Move Enum to original position on UI level */
                    this.left = this.originalLeft;
                    this.top = this.originalTop;

                    this.alignItems();

                    /* If targeted Info already linked, dont connect*/
                    if(targetedItem.getEnumId()) {
                        break;
                    }
                    /* Link Item with Enum on UI level (view) */
                    await this.$parent.addLineOnRuntime(itemId, this.unit.getUID(), { isInfoToEnum: true });

                    /* Link Item with Enum on Data level (model) */
                    targetedItem.setEnumId(this.unit.getUID());
                    return;
                }
                this.$el.classList.remove('highlight');
            }
            // TODO: just in case, maybe unnecessary
            this.alignItems();
        
        },
        onDelete() {
            let board = this.$parent;

            /* Delete connected lines, and update conneted item data */
            this.lines.forEach((lineId) => {
                let line = board.$refs[lineId];
                let infoItem = line.src;
                infoItem.removeLineToEnum();
                board.deleteLineOnRuntime(lineId);
            });
            
            /* Delete contained Types on Enum */
            this.unit.getContainedUnits().forEach((unitId) => {
                let unit = board.$refs[unitId];
                unit.onDelete();
            })
            board.deleteUnitOnRuntime(this.$el.ref);
        },
        /* Unit methods */
        removeUnitFromEnum(unitId) {
            // Targeted unit is usually Type - TODO: Ask sapir 
            let targetedUnit = this.$parent.$refs[unitId];
            targetedUnit.setEnumContainerId(null);
            this.unit.removeUnitFromEnum(unitId);
            this.alignItems();
        },
        addUnitToEnum(unitId) {
            console.log('pokpopokjinibubyuibuy');
            // Assign targeted unit's enum container to this Enum container id
            let targetedUnit = this.$parent.$refs[unitId];
            // Establish relationship between the Enum and the added Unit on the Data level
            targetedUnit.setEnumContainerId(this.unit.getUID());
            this.unit.addUnitToEnum(unitId);
            // Align and move element according to the relationship on UI level
            this.createPlaceHolders();
            this.alignItems();
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
                unit.top = self.$el.querySelector('.unit-enum__header').getBoundingClientRect().bottom + (index * unit.$el.getBoundingClientRect().height);
            });
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
        removePlaceholders() {
            
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