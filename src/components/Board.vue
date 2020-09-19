<template>
  <div id="board">
      <unit v-for="unit in boardData" :key="unit.id" :data-id="unit.id"></unit>
    <!-- <svg id="svg">
        <path class="path"/>
    </svg> -->
  </div>
</template>

<script>
    import Unit from './Unit';
    //import postscribe from 'postscribe'

    import PlainDraggable from 'plain-draggable';

                let getUnitbyId = function(id) {
                    return document.querySelector('[data-id="'+id+'"]');
                }

    export default {
        components: {
            Unit
        },
        data: function() {
            return {
            //units: [{x: 50, y: 50}]
                activeItem: null,
                activeUnit: null,
                dragActive: false,
                boardData:[ {id: 1, type:'DS', xOffset:20, yOffset:20}],
                paths: [{from: 1, to: 2, type: 'default'},
                        {from: 2, to: 3, type: 'default'}]
            }
        },
        watch: {
            //  boardData: function() {
            //      this.render();
            //  }
        },
        mounted: function() { 
            new PlainDraggable(getUnitbyId(1));

            this.render();
            // const plugin = document.createElement("script");
            // plugin.setAttribute(
            // "src",
            // "../assets/plain-draggable"
            // );
            // plugin.async = true;
            // document.head.appendChild(plugin);

            // plugin.setAttribute(
            // "src",
            // "../assets/leader-line"
            // );
            //             document.head.appendChild(plugin);

        },
        methods: {
            render: function () {

               // Render Units on screen and connections
                // let renderUnits = function (self) {
                //     for (const unit of self.boardData) {
                //         // Render unit movement
                //         let el = getUnitbyId(unit.id);
                //         self.setTranslate(unit.xOffset, unit.yOffset, el);
                //     }
                // }
                // renderUnits();

                // let renderPaths = function (self) {
                //     let ePath = document.querySelector('.path');
                //     var eHandles = document.querySelectorAll(".handle");

                //     self.paths.forEach(path => {
                //         let from = self.boardData.find(u=>u.id===path.from);//getUnitbyId(path.from);
                //         let to = self.boardData.find(u=>u.id===path.to);

                //         let bezierWeight = 0.675;
                //         let x1 = from.xOffset+123, y1 = from.yOffset + 63;
                //         let x4 = to.xOffset+3, y4 = to.yOffset+63;
                //         window.TweenLite.set((eHandles[0], { x: x1, y: y1}));
                //         window.TweenLite.set((eHandles[1], { x: x4, y: y4}));


                //         var dx = Math.abs(x4 - x1) * bezierWeight;
                        
                //         var x2 = x1 - dx;
                //         var x3 = x4 + dx;
  
                    
                //         var data = `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;                        
                //         ePath.setAttribute("d", data);
                //     });
                // }

                // new PlainDraggable(getUnitbyId(1));
               // window.LeaderLine(getUnitbyId(1), getUnitbyId(2));

                // let LeaderLine = window.LeaderLine;
                // console.log(LeaderLine);
                // Rendering Units and Paths on screen 
                //renderUnits(this);
                //renderPaths(this);
            },
            // renderPath: function(x1,y1,x2,y2, el) {

            // },
            mousedown: function(e) {
                const target = e.target;

                if (target !== e.currentTarget) {
                    this.dragActive = true;
                    
                    // This is the item we interact with 
                    this.activeItem = target;

                    console.log(this.activeItem);
                    if (this.activeItem !== null) {
                        // If activeItem is Unit
                        this.activeUnit = this.boardData.find(el => el.id == this.activeItem.getAttribute('data-id'));
                        console.log(this.activeUnit);
                        if (this.activeUnit)
                        if (!this.activeItem.xOffset) {
                            this.activeItem.xOffset = this.activeUnit.xOffset;
                        }
                        if (!this.activeItem.yOffset) {
                            this.activeItem.yOffset = this.activeUnit.yOffset;
                        }
                        console.log("doing something!");
                        this.activeItem.initialX = e.clientX - this.activeItem.xOffset;
                        this.activeItem.initialY = e.clientY - this.activeItem.yOffset;
                        console.log(this.activeItem.initialX);
                    }
                }
            },
            mouseup: function () {
                if(this.activeItem !== null) {
                    this.activeItem.initalX = this.activeItem.currentX;
                    this.activeItem.initalY = this.activeItem.currentY;
                }
                this.dragActive = false;
                this.activeItem = null;
            },
            mousemove: function(e) {
                if (this.dragActive) {

                    // Set dragged element current X,Y 
                    this.activeItem.currentX = e.clientX - this.activeItem.initialX;
                    this.activeItem.currentY = e.clientY - this.activeItem.initialY;
                
                    // Set current 
                    this.activeItem.xOffset = this.activeItem.currentX;
                    this.activeItem.yOffset = this.activeItem.currentY;

                    if (this.activeUnit) {
                        console.log('oidjfgiojdfgidjiodjfgidjfg');
                        this.activeUnit.xOffset = this.activeItem.currentX;
                        this.activeUnit.yOffset = this.activeItem.currentY;
                    }
                    
                    this.render();
                }
            },
            setTranslate: function(xPos, yPos, el) {
                // el.style.top = yPos+'px';
                // el.style.left = xPos+'px';
                el.style.transform = 'translate3d('+xPos+'px,'+yPos+'px,0)';
            }
        }
    }
</script>

<style>
    #board {
        position: relative;
        width: 100vw;
        height: 100vh;
    }
    #svg {
    width: 100%;
    height: 100%;
    z-index: -1;
    }

    .handle {
    fill: dodgerblue;
    }

    .path {
    fill: none;
    stroke: rgb(66, 150, 253);
    stroke-width: 5;
    }

</style>