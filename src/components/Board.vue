<template>
        <div id="board" v-if="isInitialized">
            <svg xlmns="http://www.w3.org/2000/svg" class="lines">
                <defs>
                    <marker id="black-arrow" markerWidth="5" markerHeight="5" refX="0" refY="5"
                    viewBox="0 0 10 10" orient="auto-start-reverse" style="opacity: 0.85">
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="rgba(255,0,0,0.9)" />
                    </marker>
                    <marker id="arrow1" viewBox="0 0 492.004 492.004" markerWidth="5" markerHeight="5" refX="285" refY="246" orient="auto-start-reverse">
                        <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                        c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                        c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                        c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"/>
                    </marker>

                </defs>
                <line-kit v-for="line in lines" :key="line.id" :ref="line.id"
                    class="line"
                    :src="line.src"
                    :dest="line.dest"
                    :id="line.id"
                    :scale="scale"
                    :options="line.options"
                    :zIndex="zIndex">
                </line-kit>
            </svg>
            <template v-for="(unit) in unitList"
                :key="unit._id">
                <type-unit class="unit" v-if="unit._type === 'Type'"
                    :ref="unit._id"
                    :unit="unit"
                    :zIndex="zIndex"
                    v-on:unitdragstart="zIndexUpdate"
                    @unitdragend="unitdragend"
                    style="width: auto; height: auto;">
                </type-unit>
                <point-unit class="unit" v-if="unit._type === 'Point'"
                    :ref="unit._id"
                    :unit="unit"
                    :zIndex="zIndex"
                    @unitdragstart="zIndexUpdate"
                    @unitdragend="unitdragend"
                    style="width: auto; height: auto;">
                </point-unit>
                <enum-unit class="unit" v-if="unit._type === 'Enum'"
                    :ref="unit._id"
                    :unit="unit"
                    :zIndex="zIndex"
                    :isBoardRendered="isRendered"
                    @unitdragstart="zIndexUpdate"
                    @unitdragend="unitdragend"
                    style="width: auto; height: auto;">
                </enum-unit>
                <relation-unit class="unit" v-if="unit._type === 'Relation'"
                    :ref="unit._id"
                    :unit="unit"
                    :zIndex="zIndex"
                    :isBoardRendered="isRendered"
                    @unitdragstart="zIndexUpdate"
                    @unitdragend="unitdragend"
                    style="width: auto; height: auto;">
                </relation-unit>
                <item-unit class="unit" v-if="unit._type === 'Item'"
                    :ref="unit._id"
                    :unit="unit"
                    :zIndex="zIndex"
                    @unitdragstart="zIndexUpdate"
                    @unitdragend="unitdragend"
                    style="width: auto; height: auto;">
                </item-unit>
                <group-unit class="unit" v-if="unit._type === 'Group'"
                    :ref="unit._id"
                    :unit="unit"
                    :zIndex="zIndex"
                    :isBoardRendered="isRendered"
                    @unitdragstart="zIndexUpdate"
                    @unitdragend="unitdragend"
                    style="width: auto; height: auto;">
                </group-unit>

            </template> 
            <template v-for="(unit) in unitList"
                :key="unit._id">

            </template>             
            <template v-for="(unit) in unitList"
                :key="unit._id">

            </template> 
            <template v-for="(unit) in unitList"
                :key="unit._id">

            </template>
            <template v-for="(unit) in unitList"
                :key="unit._id">

                <!-- <div :ref="unit._id" v-if="unit._type === 'Group' && renderKey >= 6">a</div> -->
            </template> 
            <template v-for="(unit) in unitList"
                :key="unit._id">

                <!-- <div :ref="unit._id" v-if="unit._type === 'Group' && renderKey >= 6">a</div> -->
            </template> 


            <div id="control-point"></div>
            <selection-box v-if="cursor=='addGroup'" ref="selection-box"></selection-box>
        </div>
        <contextmenu-kit ref="contextmenu"></contextmenu-kit>
        
        <!-- If Board rendering/Uinitilized show Loader for UX purposes -->
        <loader-kit v-if="!isRendered"></loader-kit>
</template> 

<script>
    // import Selection from "@simonwep/selection-js";
    import { boardStore } from "../store/board";
    import ItemUnit from './Units/Item';
    import TypeUnit from './Units/Type';
    import EnumUnit from './Units/Enum';
    import RelationUnit from './Units/Relation';
    import GroupUnit from './Units/Group';
    import PointUnit from './Units/Point';

    import Loader from './Kit/Loader';
    import Line from './Kit/Line';
    import ContextMenu from './Kit/ContextMenu';
    import SelectionBox from './Kit/SelectionBox';

    import { Relation, Enum, Type , Group, Point} from '../assets/js/unit-classes';
import { Helpers } from '../assets/js/Helpers';

    function getScaleMultiplier(delta) {
      var sign = Math.sign(delta), speed = 1;
      var deltaAdjustedSpeed = Math.min(0.25, Math.abs(speed * delta / 128));
    //   let result = 1 - sign * deltaAdjustedSpeed;
      return 1 - sign * deltaAdjustedSpeed;
    }

    export default {
        components: {
            /* Unit components  */
            'item-unit':ItemUnit,
            'type-unit':TypeUnit,
            'enum-unit':EnumUnit,
            'relation-unit':RelationUnit,
            'point-unit': PointUnit,
            'group-unit': GroupUnit,
            /* Kit components */
            'line-kit': Line,
            'loader-kit': Loader,
            'contextmenu-kit': ContextMenu,
            'selection-box': SelectionBox
        },
        data: function () {
            return {    
                // Functional data
                selectedUnits: [],
                selectionjs: null,
                relateFrom: null,
                relateTo: null,
                relateType: null,
                cursor: 'default',
                zIndex: 1000,
                // Vuejs data 
                isRendered: false,
                renderKey: 0,
                // UI vars
                scale: 1,
                unitList: [],
                lines: [],
                panBoardBy: [0,0]
            }
        },
        beforeMount: async function() {
            await boardStore.init();
            this.unitList = boardStore.getUnitList();
            this.scale = boardStore.getScale();
        },
        mounted: async function() {
            let self = this;

            /* Wait for values from data to load */
            await this.$nextTick();

            // Render Units by dependency order, from least to most. 
            // Types -> Enums -> Items -> Relations 
            for (let index = 0; index < 6; index++) {
                setTimeout(() => {
                    self.renderKey++;
                    if (index+1 === 6) {
                        setTimeout(()=> {
                            // Change units to their scale as saved in DB
                            self.unitList.forEach((unitObj) => {
                                let unit = self.$refs[unitObj.getUID()];
                                if (unit) {
                                    unit.internalScaleTo(-1, -1, self.scale);                                    
                                }
                            });
                            boardStore.setUnitList(self.unitList);
                            boardStore.setScale(self.scale);
                            self.renderKey++;
                            self.isRendered = true;
                        }, 200)
                    }
                }, 200 * (index+1));               
            }
        },
        methods: {
            setInteractions() {
                var self = this;
                /* Vars to cache event state */
                var evCache = new Array(); 
                let prevDistance = -1;
                var center;
                // var lastCenter;
                var lastX, lastY;
                var initialX,initialY;
                var pressedUnit, pressedLine, pressedConnector, pressedBoard;    
                
                function calculateDistance(point1, point2) {
                    return Math.sqrt(Math.pow(point1.clientX - point2.clientX, 2) + Math.pow(point1.clientY - point2.clientY,2));
                }

                function closest(elementArr, lookup) {
                    for (let index = 0; index < elementArr.length; index++) {
                        const element = elementArr[index].closest(lookup);
                        if (element) {
                            return element;
                        }
                    }
                    return null;
                }

                /* Handle ponter down event */
                async function pointerdown_handler(ev) {
                    ev.preventDefault();

                    var selection = window.getSelection ? window.getSelection() : document.selection ? document.selection : null;
                    if(!selection) selection.empty ? selection.empty() : selection.removeAllRanges();

                    /* Unfocus edited Unit element */
                    let activeElement = document.activeElement.closest('.unit');
                    if (activeElement) {
                        self.$refs[activeElement.ref].editmode = false;
                    }

                    /* Show context menu in click position */
                    let contextMenu = self.$refs['contextmenu'];
                    if (contextMenu.isActive()) {
                        contextMenu.deactivate();
                    }
                    // contextElement.style.transform = 'scale(0)';
                     
                    if (evCache.length) {
                        if (evCache[0].ctrlKey) {
                            remove_event(evCache[0]);
                        }   
                    }



                    // Cache pointer event for multi-pointer interactions
                    evCache.push(ev);
                    
                    /* 1 pointer interaction, cache X,Y position */
                    if (evCache.length === 1) {
                        lastX = evCache[0].clientX;
                        lastY = evCache[0].clientY;

                        // console.log();
                        /* Figure unit,line,connector,board values from the pressed element */
                        pressedUnit = closest(document.elementsFromPoint(lastX, lastY),".unit");
                        if (pressedUnit && pressedUnit.classList.contains('placeholder')) 
                            pressedUnit = pressedUnit.parentNode.closest(".unit");
                        pressedLine = closest(document.elementsFromPoint(lastX, lastY),".line");
                        pressedConnector = closest(document.elementsFromPoint(lastX, lastY),".connector");
                        pressedBoard = closest(document.elementsFromPoint(lastX, lastY),"#board");

                        /* If line is clicked inside group, make the line count */
                        if (pressedUnit) {
                            if (pressedUnit.classList.contains('unit-group') && pressedLine) {
                                pressedUnit = null;
                            }
                        }

                        if (pressedConnector) {
                                // let isLeft = ev.target.closest('.connector-left');
                                // let isTop = ev.target.closest('.connector-top');
                                // let isRight = ev.target.closest('.connector-right');
                                // let isBottom = ev.target.closest('.connector-bottom');

                                
                                console.log(pressedConnector);
                        }
                        /* Click on Unit element  */
                        else if (pressedUnit) {
                            if (pressedUnit.classList.contains('placeholder')) 
                                pressedUnit = pressedUnit.parentNode.closest(".unit");
                            let unitId = pressedUnit.ref;

                            switch (self.cursor) {
                                case 'default':
                                    if (ev.ctrlKey) {
                                         self.$refs[pressedUnit.ref].editmode = false;
                                    }
                                    else {
                                        self.$refs[unitId].onDragStart();
                                    }
                                    break;
                                case 'delete': 
                                    self.$refs[unitId].onDelete();
                                    break;
                                case 'linkage':
                                    // console.log(pressedUnit.classList);
                                    if (pressedUnit.classList.contains('unit-item') || pressedUnit.classList.contains('unit-group') || pressedUnit.classList.contains('unit-relation')) {
                                        self.createRelation(null,unitId, self.relateType);                                    
                                    }
                                    break;
                            }                            
                        } else if (pressedLine) {
                            pressedLine = pressedLine.querySelector('path');
                            const line = self.$refs[pressedLine.ref];
                            let point;

                            if (line.options.isUnitToRelation || line.options.isRelationToUnit) {
                                // let line = self.lines.find((l) => l.id === pressedLine.ref);
                                    
                                if (line.options.isUnitToRelation) {      
                                    const pointType = line.src.unit._prevType || line.src.unit.getType();
                                    console.log(pointType);
                                    point = new Point(ev.clientX - 10*self.scale,ev.clientY - 10*self.scale, pointType);
                                    await self.addUnitOnRuntime(point);

                                    // /* Change line destination to new Point */
                                    let relation = line.dest;
                                    if (relation.unit.getSrcId() === relation.unit.getDestId()) {
                                        await relation.changeDestOnRuntime(relation.unit.getDestId());
                                    }
                                    await relation.changeSrcOnRuntime(point.getUID());
                                } else if (line.options.isRelationToUnit) {
                                    const pointType = line.dest.unit._prevType || line.dest.unit.getType();
                                    point = new Point(ev.clientX - 10*self.scale,ev.clientY - 10*self.scale, pointType);
                                    await self.addUnitOnRuntime(point);
                                    
                                    // /* Change line destination to new Point */
                                    let relation = line.src;
                                    console.log(relation.settings);
                                    if (relation.unit.getSrcId() === relation.unit.getDestId()) {
                                        await relation.changeSrcOnRuntime(relation.unit.getSrcId());
                                    }
                                    await relation.changeDestOnRuntime(point.getUID());
                                }
                                pressedUnit = self.$refs[point.getUID()].$el;
                            } else if(line.options.isInfoToEnum) {
                                pressedLine = null;
                            }
                            // const line = self.$refs[pressedLine.ref];
                            // line.onpointerdown(ev);
                            
                            // self.deleteLineOnRuntime(pressedLine.ref);
                        }
                        /* Click on Board element */ 
                        else {
                            switch (self.cursor) {
                                case 'addEnum': 
                                    var enumUnit = new Enum(ev.clientX,ev.clientY);
                                    await self.addUnitOnRuntime(enumUnit);
                                    self.$refs[enumUnit.getUID()].isGhost = true; 
                                    break;
                                case 'addType': 
                                    var typeUnit = new Type(ev.clientX, ev.clientY);
                                    await self.addUnitOnRuntime(typeUnit);
                                    self.$refs[typeUnit.getUID()].isGhost = true;
                                    break;
                                case 'addGroup': 
                                    initialX=ev.clientX; //+ document.body.querySelector('#board').offsetTop;
                                    initialY=ev.clientY; //+ document.body.querySelector('#board').offsetLeft;
                                    self.$refs['selection-box'].pointerY = initialY;
                                    self.$refs['selection-box'].pointerX = initialX;
                                    break;
                            }
                        }
                    }
                    /* 2 pointer interaction, cache center of pinch */
                    if (evCache.length === 2) {
                        let centerX = (evCache[0].clientX + evCache[1].clientX)/2;
                        let centerY = (evCache[0].clientY + evCache[1].clientY)/2
                        center = { x: centerX, y: centerY };
                    }
                }

                /* Handle pointer move event  */
                function pointermove_handler(ev) {
                    ev.preventDefault();

                    // Find this event in the cache and update its record with this event
                    for (var i = 0; i < evCache.length; i++) {
                        if (ev.pointerId == evCache[i].pointerId) {
                            evCache[i] = ev;
                            break;
                        }
                    }

                
                    /* Single pointer gestures - panning, Unit movement */
                    if (evCache.length == 1 && !evCache[0].isRightClick) {
                        if (self.cursor === 'delete' ) {
                            return;
                        }

                        let movementX = evCache[0].clientX - lastX;
                        let movementY = evCache[0].clientY - lastY;
                        lastX = evCache[0].clientX;
                        lastY = evCache[0].clientY;
                        if (pressedConnector) {
                            console.log('asdasd');
                        }
                        else if (pressedUnit) {
                            let unitId = pressedUnit.ref;
                            self.$refs[unitId].onDrag(movementX, movementY);
                        } else if(pressedLine) {
                            const line = self.$refs[pressedLine.ref];
                            line.onpointermove(ev);
                        }/* Cursor on Board element */
                        else if(pressedBoard) {
                            if (self.cursor === 'addGroup') {
                                self.$refs['selection-box'].height += movementY;
                                self.$refs['selection-box'].width += movementX;
                            }
                            if (self.cursor === 'default') {
                                self.internalMoveBy(movementX, movementY);
                            }
                        }
                    }

                    /* Double pointer gestures (pinch, pinch W panning) */
                    if (evCache.length == 2 && !evCache[0].isRightClick) {
                        var curDistance = calculateDistance(evCache[0], evCache[1]);

                        if (prevDistance > 0) {
                            /* Scale according to the  */
                            let scaleBy = curDistance/prevDistance;
                    
                            /* Bound scale from 1.5 to 0.2 */
                            // if (self.scale*scaleBy > 1.5 || self.scale*scaleBy < 0.01) {
                            //     return false;
                            // }
                            self.unitList.forEach((unitObj)=>{
                                let unit = self.$refs[unitObj.getUID()];
                                unit.internalScaleTo(center.x, center.y, scaleBy);
                            });

                            self.scale *= scaleBy;
                            boardStore.setScale(self.scale);
                        }
                        
                        /* TODO: Pan by the movement of center of points,
                         - by caching center and calcualting difference */
                        // lastCenter = {};

                        // Cache the distance for the next move event 
                        prevDistance = curDistance;
                    }
                }

                /* Handle relesing of the pointer */
                function pointerup_handler(ev) {
                    ev.preventDefault();

                    // Remove this pointer from the cache
                    remove_event(ev);

                    if (self.cursor !== 'default') {
                        self.cursor = 'default';
                        return;
                    }

                    // If the number of pointers down is less than two then reset
                    if (evCache.length < 2) {
                        prevDistance = -1;
                        lastX =0; lastY=0;
                        evCache = [];

                        if (pressedConnector) {
                            console.log('asasd');
                        }
                        else if (pressedUnit) {
                            let unitId = pressedUnit.ref;
                            let unit = self.$refs[unitId];
                            if (unit) {
                                unit.onDragEnd();
                            }
                            
                            if (ev.ctrlKey && !pressedUnit.closest('.unit-point')) {
                                /* Show context menu in click position */
                                let contextMenu = self.$refs['contextmenu'];
    
                                console.log(pressedUnit);
                                /* Show relatable contextmenu only on Unit context click */
                                if (pressedUnit.closest('.unit-item') || pressedUnit.closest('.unit-relation') || pressedUnit.closest('.unit-group')) {
                                    contextMenu.$el.classList.add('relatable');
                                } else {
                                    contextMenu.$el.classList.remove('relatable');
                                }
                                
                                if (pressedUnit.closest('.unit-type')) {
                                    self.$refs[unitId].onDragStart();
                                }
                                contextMenu.activate(pressedUnit.ref, ev.clientX, ev.clientY);                                
                            }
                            
                            pressedUnit.classList.remove('dragged');
                        } else if (pressedLine) {
                            const line = self.$refs[pressedLine.ref];
                            line.onpointerup(ev);
                        }
                    }
                }

                // Remove pointer event from the cache
                function remove_event(ev) {
                    for (var i = 0; i < evCache.length; i++) {
                        if (evCache[i].pointerId == ev.pointerId) {
                            evCache.splice(i, 1);
                            break;
                        }
                    }
                }

                // function initLines() {
                //     /* Install event handlers for the board */
                //     var el = document.querySelector("#board .lines");
                //     el.onpointerdown = pointerdown_handler;
                //     el.onpointermove = pointermove_handler;

                //     /* Pointer has canceled */
                //     el.onpointerup = pointerup_handler;
                //     el.onpointercancel = pointerup_handler;
                // }
                // function initUnits() {
                //     /* Install event handlers for the board */
                //     var el = document.querySelector("#board .units");
                //     el.onpointerdown = pointerdown_handler;
                //     el.onpointermove = pointermove_handler;

                //     /* Pointer has canceled */
                //     el.onpointerup = pointerup_handler;
                //     el.onpointercancel = pointerup_handler;
                // }
                function init() {
                    /* Install event handlers for the board */
                    var el = document.querySelector("#board");
                    el.onpointerdown = pointerdown_handler;
                    el.onpointermove = pointermove_handler;

                    /* Pointer has canceled */
                    el.onpointerup = pointerup_handler;
                    el.onpointercancel = pointerup_handler;
                    // el.onpointerleave = pointerup_handler;

                    /* Zooming on desktop && laptop, tested on chrome and macbook */
                    el.addEventListener('wheel' , (e) => {
                        var delta = e.deltaY;
                        if (e.deltaMode > 0) delta *= 100;

                        var scaleBy = getScaleMultiplier(delta);
                        /* Bound scale from 1.5 to 0.1 */
                        if (self.scale*scaleBy > 1.5 || self.scale*scaleBy < 0.1) {
                            return false;
                        }
                        /* Apply scale to Units on screen */
                        self.unitList.forEach((unitObj)=>{
                            let unit = self.$refs[unitObj.getUID()];
                            unit.internalScaleTo(e.clientX, e.clientY, scaleBy);
                        });

                        self.scale *= scaleBy;
                        boardStore.setScale(self.scale);
                    });

                    // TODO: Maybe move it to Item/Enum elements
                    el.addEventListener('contextmenu', (ev)=> {
                        ev.preventDefault();
                        ev.isRightClick = true;

                        /* Replace pointer event with contextmenu event */
                        evCache[0] = ev;
                    });

                    /* Is G button pressed create group of selected units */
                    window.addEventListener('keyup',async (e) => {
                        if (e.key === 'g') {
                            let unitElements = Array.from(document.querySelectorAll('.selected'));
                            if (unitElements.length) {
                                let group = new Group(unitElements.map(unit=>unit.ref));
                                await self.addUnitOnRuntime(group);
                            }
                        }
                    })
                }
                
                setTimeout(init, 0);
            },
            async addUnitOnRuntime(newUnit) {
                // let self = this;
                this.unitList.push(newUnit);
                // Wait for v-for rendering (next tick) Re-render units on screen
                await this.$nextTick();
                
                this.$refs[newUnit.getUID()].internalScaleTo(-1,-1,this.scale);
                boardStore.setUnitList(this.unitList);
                boardStore.setScale(this.scale);

                console.log(this.unitList);
            },
            async deleteUnitOnRuntime(unitId) {
                this.unitList = this.unitList.filter(u => u.getUID() !== unitId);
                await this.$nextTick();
                boardStore.setUnitList(this.unitList);
                boardStore.setScale(this.scale);
            },
            /**
             * 
             */
            async addLineOnRuntime(srcId,destId, options){
                let board = this;
                const src = this.$refs[srcId];
                const dest = this.$refs[destId];

                if (!src || !dest) {
                    var loop = function() {
                        requestAnimationFrame(board.addLineOnRuntime);
                    }
                    requestAnimationFrame(loop);
                }
                // TODO: Use is as js Set instead of js Array
                /* Ordering the Id's and producing the same uid for any combinations of order */
                let uid = Helpers.generateUID();

                /* Every line is uniquely identified by uid  */
                const isLineExists = this.lines.find((line) => line.id === uid);
                if (!isLineExists) {
                    this.lines.push({src, dest, id: uid, options});
                }
                await this.$nextTick();

                src.pushLine(uid);
                dest.pushLine(uid);
            },  
            async deleteLineOnRuntime(lineId) {
                this.lines = this.lines.filter((l)=>{ 
                    if(l.id !== lineId)
                    {
                        return l;
                    } else {
                        l.src.removeLine(l.id);
                        l.dest.removeLine(l.id);
                    }

                });
                await this.$nextTick();
            },
            /**
             * Gets a Relation Unit and starts drawing procedure on screen
             */
            async createRelation(srcId,destId,type, options=null) {
                let board = this;

                if (srcId) {
                    this.relateFrom = board.$refs[srcId];
                    console.log('relation from ' + srcId);
                }
                if (destId) {
                    this.relateTo = board.$refs[destId];
                    console.log('relation to ' + destId);
                }
                if (type) {
                    this.relateType = type;
                    console.log('relation type is ' + type);
                }

                /* Destination is missing, indicate Relation linkage */
                if (destId == null && this.cursor !== 'linkage') {
                    this.cursor = 'linkage';   
                }

                if (this.relateFrom && this.relateTo && this.relateType) {
                    let srcGroup = this.relateFrom.groupContainer;
                    let destGroup = this.relateTo.groupContainer;

                    if (srcGroup === destGroup) {

                        let relation = new Relation(this.relateFrom.unit.getUID(), this.relateTo.unit.getUID(), this.relateType, options);
                        await this.addUnitOnRuntime(relation);

                        /* If related items are in a group, add relation to group */
                        if (srcGroup && srcGroup == destGroup) {
                            srcGroup.addItem(relation.getUID());
                            this.$refs[relation.getUID()].groupContainer = srcGroup;
                        }          
                    }
                    this.relateFrom = null;
                    this.relateTo = null;
                    this.relateType = null;
                }
            },
            internalMoveBy(dx,dy) {
                let self = this;
                self.unitList.forEach((unitObj) => {
                    let unit = self.$refs[unitObj.getUID()];
                    unit.moveBy(dx,dy);
                });
            },
            internalScaleTo(cx,cy, scaleBy) {
                let self = this;
                self.scale *= scaleBy;
                self.unitList.forEach((unitObj) => {
                    let unit = self.$refs[unitObj.getUID()];
                    if (unit) {
                        unit.internalScaleTo(cx, cy, scaleBy);
                    }
                })
            },
            zIndexUpdate() {
                this.zIndex++;
            },
            unitdragend() {
                boardStore.setUnitList(this.unitList);
                boardStore.setScale(this.scale);
            },
            keyup(e) {
                console.log(e);
            }
        },
        computed: {
            isInitialized: function() {
                return boardStore.isInitialized;
            },
            // unitList: function() {
            //     // TODO: Deserilize unitList in this stage of code for SOC
            //     let unitList =  boardStore.getState().unitList;
            //     console.log('unitList has been modified to ', unitList);

            //     // unitList as Unit objects
            //     return boardStore.getUnitList();
            // }
        },
        watch: {
            isRendered: function() {
                this.setInteractions();
            },
            cursor: function(cursor){
                if (cursor === 'linkage') {
                    document.body.style.cursor = 'cell';
                }
                if (cursor === 'default') {
                    document.body.style.cursor = 'default';
                }
                if (cursor === 'delete') {
                    document.body.style.cursor = 'not-allowed';
                }
                if (cursor === 'addEnum' || cursor === 'addType') {
                    document.body.style.cursor = 'copy';
                }
                if (cursor === 'addGroup') {
                    document.body.style.cursor = 'crosshair';
                }
            }
        }
    }
</script>

<style lang="scss">
    #board {
        position: absolute;
        width: 100%;
        height: 100%;
        // border: 5px solid black;
        overflow: hidden;
        -webkit-overflow-scrolling: touch;
    }
    .lines {
        position: fixed;
        display: block;
        width: 100%;
        height: 100%;
        z-index: 500;
    }
    .units {
        position: absolute;
        width: 100%;
        height: 100%;
        display: block;
    }
    /* BASE UNIT SETTINGS */
    .unit {
        position: absolute;
        padding: 10px;
        background: white;
        border-width: 3px;
        border-style: solid;
        border-radius: 12px;
        // box-shadow: rgba(40, 60, 75, 0.15) 0px 3px 6px;
        transition: box-shadow .2s ease-in-out;
        transition: scale .2s ease-in-out;
        transition: border-color .3s ease;  
        transform-origin: 0% 0%;
        z-index: 999;

        &.selected {
            border-style: dashed;
        }
        &:active {
            // box-shadow: rgba(40, 60, 75, 0.35) 0px 20px 60px;  
            -webkit-transform: scale(1.2);
            -moz-transform: scale(1.2);
            -o-transform: scale(1.2);
            transform: scale(1.2);
        }
        &.placeholder {
            position: relative;
            cursor: inherit;
            -webkit-transform: none;
            transform: none;

            z-index: inherit;
        }

        br {
            display: none;
        }

        &.isghost {
            border-style: dashed;
            background-color: rgba($color: white, $alpha: 0.5);
            // border-color: rgba(176, 179, 0, 0.7); 
        }
    }
    
    [disabled="true"].single-line br {
        display:none;

    }
    [disabled="true"].single-line * {
        display:none;
        white-space:nowrap;
    }

    .selection {
        background-color:rgba(66, 150, 253, .1);
        z-index: 99999 !important;
    }

    .hidden {
        visibility: 0;
    }

    img.add {
        background: url('../assets/logo.png');
    }
</style>

