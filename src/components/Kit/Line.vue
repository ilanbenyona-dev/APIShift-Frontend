<template class="line">
    <!-- Info-to-Enum dashed line -->
        <g>
            <path
                :marker-start="getComputedMarkerStart"
                :marker-end="getComputedMarkerEnd"
                :style="getComputedStyle"  
                :d="getComputedPath"
                >
            </path>
        </g>
</template>

<script>
import { Constants } from '../../assets/js/Helpers';

export default {
    mounted: function() {
        let self = this;

        this.updateHandlers();

        /* Update line on animation interval in the initial 3 seconds */
        let start_time = new Date();
        let updateOften = function() {
            self.updateLine();
            if (new Date()-start_time > 3000) {
                return;
            }
            requestAnimationFrame(updateOften);
        }
        requestAnimationFrame(updateOften);
    },
    data: function() {
        return {
            destHandle: null,
            srcHandle: null, 
            r: 0,
            bezierWeight: 0.625,
            cx: 0,
            cy: 0
        }
    },    
    methods: {
        /* Move unit */
        moveBy: function(dx,dy) { 
            this.left += dx;
            this.top += dy;
        },
        internalScaleTo: function(cx, cy, scaleBy) {
            if (cx != -1 && cy != -1) {
                this.left = (this.left * scaleBy + (cx) * (1-scaleBy));
                this.top = (this.top * scaleBy + (cy) * (1-scaleBy));   
            }
        },
        updateLine() {
            let self = this;
            this.$forceUpdate();
            requestAnimationFrame(() => {
                self.r += 0.00000000000000001;
            })
            // this.r += 0.00000000000000001;// | (this.r);
            // console.log(this.r);
            // let point = this.$el.nextElementSibling.querySelector('.point');
            // let px = this.x4, py = this.y4;
            // point.style.transform = `translate3d(${px}px, ${py}px,0)`;
            // requestAnimationFrame(this.updateLine);
        },
        updateHandlers() {
            let self = this;
            this.$el.ref = this.id;
            this.$el.nextElementSibling.querySelector('path').ref = this.id;
            this.left = this.x4; this.top = this.y4;
            // let container = this.$el.nextElementSibling.getBoundingClientRect();

            if(!self.src || !self.dest) return;
            if (this.options.isInfoToEnum) {
                this.srcHandle = this.src.$el.querySelector('.connector-enum');
                this.destHandle = this.dest.$el;
                this.bezierWeight = 0;
            }
            else if (this.options.isRelationToRelation) {
                this.srcHandle = this.src.$el.querySelector('.connector-bottom');
                this.destHandle = this.dest.$el.querySelector('.connector-top');
                this.bezierWeight = 0.7;
            }
            else if (this.options.isUnitToRelation) {
                this.srcHandle = this.src.$el.querySelector('.connector-right');
                this.destHandle = this.dest.$el.querySelector('.connector-left');
                // if (this.options.isReverse) {
                //     this.srcHandle = this.src.$el.querySelector('.connector-left');
                //     this.destHandle = this.dest.$el.querySelector('.connector-right');
                // }
                this.bezierWeight = 0.7;
            }
            else if (this.options.isRelationToUnit) {
                this.srcHandle = this.src.$el.querySelector('.connector-right');
                this.destHandle = this.dest.$el.querySelector('.connector-left');
                // if (this.options.isReverse) {
                //     this.srcHandle = this.src.$el.querySelector('.connector-left');
                //     this.destHandle = this.dest.$el.querySelector('.connector-right');
                // }
                this.bezierWeight = 0.7;
            }
        },
        // changeSrc(newSrc) {
        //     this.src = newSrc;
        // },
        // changeDest(newDest) {
        //     this.dest = newDest;
        // },
        onpointerdown(e) {
            e.preventDefault();
            e.stopPropagation();

            let point = this.$el.nextElementSibling.querySelector('.point');
            this.cx = e.clientX; this.cy = e.clientY;

            if (this.options.isRelationToUnit) {
                this.destHandle = point;
            }
            else if (this.options.isUnitToRelation) {
                this.srcHandle = point;
            }

            setTimeout(() => {
                this.updateLine();
            }, 0);
        },
        onpointermove(e) {
            this.cx = e.clientX; this.cy = e.clientY;

            // this.updateLine();
        },
        onpointerup(e) {
        //     let point = this.$el.nextElementSibling.querySelector('.point');
        //     /* If pointer released over Item element establish connection */
        //     let itemElements = document.querySelectorAll('.unit-info') || document.querySelectorAll('.unit-relation');
        //     let i = enumElements.length;
        //     while (--i > -1) {
        //         if (Helpers.hitTest(this.$el, enumElements[i], .99)) {
        //             enumElements[i].classList.add('highlight');
        //             return;
        //         }
        //         else {
        //             enumElements[i].classList.remove('highlight');
        //         }
        //     }
        // }
            console.log(e);
        }
    },
    computed: {
        getComputedStyle() {
            if (!this.options) {
                return;
            }
            let isInfoToEnum = this.options.isInfoToEnum;
            let relationType = this.options.relationType;
            if (isInfoToEnum) {
                return this.infoToEnum;
            }
            switch(relationType) {
                case Constants.ONE_TO_ONE: {
                    return {
                        strokeWidth: 5 * this.scale,
                        fill: 'none',
                        stroke: 'grey',
                        // zIndex: this.zIndex
                    }
                }
                case Constants.ONE_TO_MANY: {
                    return {
                        strokeWidth: 5 * this.scale,
                        fill: 'none',
                        stroke: 'grey',
                        // zIndex: this.zIndex
                    }
                }
                case Constants.MANY_TO_MANY: {
                    return {
                        strokeWidth: 5 * this.scale,
                        fill: 'none',
                        stroke: 'grey',
                        // stroke: 'rgba(0,0,0,2)',
                        // zIndex: this.zIndex
                    }
                }
            }
            return null;
        },
        getComputedPath() {
            // let isInfoToEnum = this.options.isInfoToEnum;
            // let relationType = this.options.relationType;
            var x1=0,y1=0, c1x=0,c1y=0, c2x=0, c2y=0, x4=0,y4=0;

            // if (this.srcHandle === null ) {
            //     x1 = this.srcX;
            //     y1 = this.srcY;
            // } else if (this.destHandle === null) {
            //     y4 = this.destY;
            //     x4 = this.destX;
            // }

            /* 
            * The structure of the beziered cureved path is as follows:
            * M X1,Y1 C C1x,C1y C2x,C2y X4,Y4 
            */
            if (this.options.isInfoToEnum) {
                x1=this.x1; y1=this.y1;
                c1x=x1; c1y=y1;
                c2x=x1; c2y=y1;
                x4=this.x4; y4=this.y4;
            }
            else if (this.options.isRelationToRelation) {
                let py = 200*this.scale;
                let dmy = this.options.relationType !== Constants.ONE_TO_ONE ? 25*this.scale : 10*this.scale;
                if (this.options.isUnitToRelation) {
                    py *= 1;
                    x1 = this.x1;
                    y1 = this.y1;
                    c1x = this.x1;
                    c1y = this.y1 - py;
                    c2x = this.x4;
                    c2y = this.y4 + py;
                    x4 = this.x4;
                    y4 = this.y4;
                    if (this.options.relationType === Constants.MANY_TO_MANY ) {
                        y4 += dmy - 10*this.scale;
                    }
                    if (this.options.relationType === Constants.ONE_TO_MANY) {
                        y4 -= dmy - 15*this.scale;
                    }
                    if (this.options.relationType === Constants.ONE_TO_ONE) {
                        y4 -= dmy;
                    }
                }
                else if (this.options.isRelationToUnit) {
                    // py *= -1;
                    x1 = this.x1;
                    y1 = this.y1 - dmy;
                    c1x = this.x1;
                    c1y = this.y1 - py;
                    c2x = this.x4;
                    c2y = this.y4 + py;
                    x4 = this.x4;
                    y4 = this.y4;
                }
                
            }
            else {
                let dmx = this.options.relationType !== Constants.ONE_TO_ONE ? 25*this.scale : 10*this.scale;
                x1 = this.x1;
                y1 = this.y1;
                c1x = this.x1 - this.dx - dmx;
                c1y = this.y1;
                c2x = this.x4 + this.dx
                c2y = this.y4;
                // if (this.options.isReverse) {
                //     c2x = this.x1;
                //     c2y = this.y1 - py;
                //     c1x = this.x4;
                //     c1y = this.y4 + py;
                // }
                x4 = this.x4;
                y4 = this.y4;
                if (this.options.isRelationToUnit) {
                    x1 -= dmx;
                    c1x -= dmx;
                    c2x += dmx;
                    // x4 += 5 * this.scale;
                }
                if (this.options.isUnitToRelation) {
                    if (this.options.relationType === Constants.MANY_TO_MANY) {
                        x1 -= 5 * this.scale;
                        c1x -= dmx - this.scale*15;
                        c2x += dmx + 15*this.scale;
                        x4 += dmx;//5 * this.scale;
                    }
                }   
                    
            }
            if (!(x1&&y1&&c1x&&c1y&&c2x&&c2y&&c2y&&x4&&y4)) {
                console.log(`M ${x1} ${y1} C ${c1x} ${c1y} ${c2x} ${c2y} ${c2y} ${x4} ${y4}`);
            }

            return `M ${x1} ${y1} C ${c1x} ${c1y} ${c2x} ${c2y} ${x4} ${y4}`
        },
        getComputedMarkerStart() {
            let options = {...this.options};
            if (options.relationType === Constants.ONE_TO_ONE && options.isRelationToUnit) {
                return 'url(#arrow1)'
            }
            if (options.relationType === Constants.MANY_TO_MANY && options.isRelationToUnit) {
                return 'url(#black-arrow)'
            }
            if (options.relationType === Constants.ONE_TO_MANY && options.isRelationToUnit) {
                return 'url(#black-arrow)'
            }
            return undefined;
        },
        getComputedMarkerEnd() {
            let options = {...this.options};
            if (options.relationType === Constants.MANY_TO_MANY && options.isUnitToRelation) {
                return 'url(#black-arrow)'
            }
            return undefined;
        },
        getComputedRadius() {
            return 10*this.scale;
        },
        x1: function() {
            if (!(this.destHandle && this.srcHandle)) {
                return -1;
            }
            let rect = this.destHandle.getBoundingClientRect();
            return rect.left + rect.width/2 + this.r;  
        },
        y1: function() {
            if (!(this.destHandle && this.srcHandle)) {
                return -1;
            }
            let rect = this.destHandle.getBoundingClientRect();
            return rect.top + rect.height/2 + this.r;  
        },
        x4: function() {
            if (!(this.destHandle && this.srcHandle)) {
                return -1;
            }
            let rect = this.srcHandle.getBoundingClientRect();
            return rect.left + rect.width/2 + this.r;  
        },
        y4: function() {
            if (!(this.destHandle && this.srcHandle)) {
                return -1;
            }
            let rect = this.srcHandle.getBoundingClientRect();
            return rect.top + rect.height/2 + this.r;
        },
        dx: function() {
            return Math.abs(this.x4 - this.x1) * this.bezierWeight;
        },
        lineWidth: function() {
            return 4*this.scale;
        },
        transformation: function() {
            let common = {
                // transform:`translate(-3px,-3px)`,
                // left: '5px',
                // top:'5px',
            }
            
            
            return {
                ...common, 
                transform: `translate3d(${this.left}px,${this.top}px, 0) scale(${this.scale})`,
            }
        },
        infoToEnum() {
            return {
                strokeWidth: this.scale*4,
                strokeDasharray: `${11*this.scale}, ${5*this.scale}`,
                fill: 'none',
                stroke: 'black',
                // zIndex: this.zIndex
            }
        },
        oneToOne() {
            return {
                strokeWidth: 5 * this.scale,
                fill: 'none',
                stroke: 'grey',
            }
        },
        oneToMany() {
            return {
                strokeWidth: 5 * this.scale,
                fill: 'none',
                stroke: 'grey',
            }
        },
        manyToMany() {
            return {
                strokeWidth: 5 * this.scale,
                fill: 'none',
                stroke: 'grey',
            }
        },
    },
    watch: {
        options: {
            deep: true,
            handler() {
                let self = this;
                this.$el.ref = this.id;
                this.$el.nextElementSibling.querySelector('path').ref = this.id;
                this.left = this.x4; this.top = this.y4;
                // let container = this.$el.nextElementSibling.getBoundingClientRect();

                if(!self.src || !self.dest) return;
                if (this.options.isInfoToEnum) {
                    this.srcHandle = this.src.$el.querySelector('.connector-enum');
                    this.destHandle = this.dest.$el;
                    this.bezierWeight = 0;
                }
                else if (this.options.isRelationToRelation) {
                    this.srcHandle = this.src.$el.querySelector('.connector-bottom');
                    this.destHandle = this.dest.$el.querySelector('.connector-top');
                    this.bezierWeight = 0.7;
                }
                else if (this.options.isUnitToRelation) {
                    this.srcHandle = this.src.$el.querySelector('.connector-right');
                    this.destHandle = this.dest.$el.querySelector('.connector-left');
                    // if (this.options.isReverse) {
                    //     this.srcHandle = this.src.$el.querySelector('.connector-left');
                    //     this.destHandle = this.dest.$el.querySelector('.connector-right');
                    // }
                    this.bezierWeight = 0.7;
                }
                else if (this.options.isRelationToUnit) {
                    this.srcHandle = this.src.$el.querySelector('.connector-right');
                    this.destHandle = this.dest.$el.querySelector('.connector-left');
                    // if (this.options.isReverse) {
                    //     this.srcHandle = this.src.$el.querySelector('.connector-left');
                    //     this.destHandle = this.dest.$el.querySelector('.connector-right');
                    // }
                    this.bezierWeight = 0.7;
                }

                this.updateLine();
            }
        }
        // x1: function(x1) {
        //     if (x1 === -1) {
        //         this.$parent.deleteLineOnRuntime(this.line.id);
        //     }
        // },
        // x2: function(y1) {
        //     if (y1 === -1) {
        //         this.$parent.deleteLineOnRuntime(this.line.id);
        //     }
        // }
    },
    props: {
        src: {
            /* Vue instance */
            type: Object
        },
        dest: {
            /* Vue instance */
            type: Object
        },
        id: {
            type: String
        },
        scale: {
            type: Number
        }, 
        options: {
            type: Object
        },
        // zIndex: {
        //     type: Number
        // }
    }
}
</script>

<style lang="scss" scoped>
    path {
        &:hover {
            cursor: pointer;
        }
    }
    #black-arrow {
        &:hover {
            cursor: pointer;
        }
    }




    .point {
        position: absolute;
        opacity: 0.5;
    }
</style>