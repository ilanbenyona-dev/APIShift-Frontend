<template>
    <div class="contextmenu" @click="deactivate" :style="transformation">
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

import { Relation, Type, Enum, Info, Point } from '../../assets/js/unit-classes';
import { Constants } from '../../assets/js/Helpers';

/* TODO: add icons to items from a CDN or something */

export default {
    components: {
    },
    data: function(){
        return {
            unitRef: null,
            left: 0,
            top: 0,
            scale: 0
        }
    },
    methods: {
        activate(unitRef, left, top) {
            this.unitRef = unitRef;
            this.left = left;
            this.top = top;
            this.scale = 1;
        },
        deactivate() {
            this.scale = 0;
            this.unitRef = null;
        },
        isActive() {
            return this.scale === 1;
        },
        editunit() {
            let unit = this.$parent.$refs[this.unitRef];
            // console.log(unit);
            unit.editmode = true;
        },
        async duplicateunit() {
            let pressedUnit = this.$parent.$refs[this.unitRef];
            let unit, board=this.$parent;
            

            switch (pressedUnit.unit.getType()) {
                case 'Type':
                    unit = new Type(pressedUnit.left, pressedUnit.top ,pressedUnit.unit.getText());
                    break;
                case 'Enum':
                    unit = new Enum(pressedUnit.left, pressedUnit.top, pressedUnit.unit.getText());
                    break;
                case 'Info':
                    unit = new Info(pressedUnit.left, pressedUnit.top,pressedUnit.unit.getText());
                    break;
                case 'Relation':
                    var srcItem = board.$refs[pressedUnit.unit.getSrcId()];
                    var destItem = board.$refs[pressedUnit.unit.getDestId()];
                    var pointSrc, pointDest;

                    if (destItem.unit.getType() === "Point" && srcItem.unit.getType() === "Point") {
                        pointSrc = new Point(srcItem.left, srcItem.top)
                        await board.addUnitOnRuntime(pointSrc);
                        pointDest = new Point(destItem.left, destItem.top)
                        await board.addUnitOnRuntime(pointDest);
                        unit = new Relation(pointSrc.getUID(), pointDest.getUID(), pressedUnit.unit.getRelationType(), pressedUnit.unit.getText());
                    }
                    else if (srcItem.unit.getType() === "Point") {
                        pointSrc = new Point(srcItem.left, srcItem.top)
                        await board.addUnitOnRuntime(pointSrc);
                        unit = new Relation(pointSrc.getUID(), pressedUnit.unit.getDestId(), pressedUnit.unit.getRelationType(), pressedUnit.unit.getText());
                    }
                    else if (destItem.unit.getType() === "Point") {
                        pointDest = new Point(destItem.left, destItem.top)
                        await board.addUnitOnRuntime(pointDest);
                        unit = new Relation(pressedUnit.unit.getSrcId(), pointDest.getUID(), pressedUnit.unit.getRelationType(), pressedUnit.unit.getText());
                    }
                    else if (!pointDest && !pointDest) {
                        unit = new Relation(pressedUnit.unit.getSrcId(), pressedUnit.unit.getDestId(), pressedUnit.unit.getRelationType(), pressedUnit.unit.getText());
                    }
                    break;
            }
            this.$parent.addUnitOnRuntime(unit);
        },
        deleteunit() {
            let unit = this.$parent.$refs[this.unitRef];
            unit.onDelete();
        },
        // 'chevron-svg': Chevron
        createRelation: function(relationType) {
            if (!this.unitRef) {
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

            
            this.$parent.createRelation(this.unitRef, null, type);
        }
    },
    computed: {
        transformation: function () {
            return {
                left: `${this.left}px`,
                top: `${this.top}px`,
                transform: `scale(${this.scale})`,
            }
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
        border-radius: 5px;
        transform: scale(0);
        transform-origin: top left;
        transition: transform 300ms ease-in-out;

        &.active {
            transition: transform 300ms ease-in-out;
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