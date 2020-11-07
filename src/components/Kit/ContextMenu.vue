<template>
    <div class="contextmenu" @click="close">
        <ul>
            <li class="item edit" @click="editunit"> Edit</li>
            <li class="item duplicate" @click="duplicateunit"> Duplicate</li>
            <li class="item relate"> Relate 
                <ul class="relate-types">
                    <li class="item o-to-o" @click="createRelation('onetoone')"> One-to-One</li>
                    <li class="item o-to-m" @click="createRelation('onetomany')"> One-to-Many</li>
                    <li class="item m-to-m" @click="createRelation('manytomany')"> Many-to-Many</li>
                </ul>
            </li>
            <li class="item delete" @click="deleteunit"> Delete</li>
        </ul>a
    </div>
</template>

<script>

import { Relation, Type, Enum, Info } from '../../assets/js/unit-classes';
import { Constants } from '../../assets/js/Helpers';

/* TODO: add icons to items from a CDN or something */

export default {
    components: {
    },
    data: function(){
        return {
            pressedUnit: null,
        }
    },
    methods: {
        editunit() {
            this.pressedUnit.editmode = true;
        },
        duplicateunit() {
            let srcUnit = this.pressedUnit.unit;
            let unit;


            switch (srcUnit.getType()) {
                case 'Type':
                    unit = new Type(this.pressedUnit.left, this.pressedUnit.top ,srcUnit.getText());
                    break;
                case 'Enum':
                    unit = new Enum(this.pressedUnit.left,this.pressedUnit.top, srcUnit.getText());
                    break;
                case 'Info':
                    unit = new Info(this.pressedUnit.left,this.pressedUnit.top,srcUnit.getText());
                    break;
                case 'Relation':
                    unit = new Relation(srcUnit.getSrcId(), srcUnit.getDestId(), srcUnit.getRelationType(), srcUnit.getText());
                    break;
            }
            this.$parent.addUnitOnRuntime(unit);
        },
        deleteunit() {
            this.pressedUnit.onDelete();
        },
        // 'chevron-svg': Chevron
        createRelation: function(relationType) {
            if (!this.pressedUnit) {
                return;
            }
            let type = null;
            if (relationType === 'onetoone') {
                type = Constants.ONE_TO_ONE;
            }
            if (relationType === 'onetomany') {
                type = Constants.ONE_TO_MANY;
            }
            if (relationType === 'manytomany') {
                type = Constants.MANY_TO_MANY;
            }

            
            console.log(this.pressedUnit);
            this.$parent.createRelation(this.pressedUnit.$el.ref, null, type);
        },
        close() {
            console.log(this.$el.style.scale);
            this.$el.style.transform = 'scale(0)';
        }   
    }
}
</script>

<style lang="scss" scoped>
    .contextmenu {
        position: fixed;
        z-index: 9999;
        width: 150px;
        background:#1b1a1a;
        border-radius:5px;
        transform:scale(0);
        transform-origin:top left;
        transition:transform 300ms ease-in-out;

        &.active {
            transition:transform 300ms ease-in-out;
        }
    
            
        ul {
            padding: 0;
            .item {
                display: flex;
                flex-direction: row;
                padding:8px 10px;
                font-size:15px;
                color:#eee;

                & hr {
                    margin:2px 0px;
                    border-color:#555;
                }
            }
            .item.relate {
                display: none;
            
                .relate-types {
                    display: none;
                    min-width: 100px;
                }
                &:hover .relate-types {
                    position: absolute;
                    background: #1b1a1a;
                    top: 50%;
                    left: 100%;
                    display: block;
                }
            }
        }
    }

    .contextmenu.relatable {
        .item.relate {
            display: block;
            display: flex;
            flex-direction: row;
        }
    }

    
</style>