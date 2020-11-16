<template>
    <!-- Info-to-Enum dashed line -->
        <g>
            <circle class="point" style="cursor: pointer;" r="1" />
            <path
                :marker-start="getComputedMarkerStart"
                :marker-end="getComputedMarkerEnd"
                :style="getComputedStyle"  
                class="line" 
                :d="getComputedPath"
                @pointerdown="onclick">
            </path>
        </g>
</template>

<script>
import { Constants } from '../../assets/js/Helpers';
export default {
    mounted: function() {
        let self = this;

        // let container = this.$el.nextElementSibling.getBoundingClientRect();

        if(!self.src || !self.dest) return;
        if (this.options.isInfoToEnum) {
            this.srcHandle = this.src.$el.querySelector('.unit-info__connector-enum');
            this.destHandle = this.dest.$el;
            this.bezierWeight = 0;
        }
        else if (this.options.isRelationToRelation) {
            this.srcHandle = this.src.$el.querySelector('.unit-relation__connector-bottom');
            this.destHandle = this.dest.$el.querySelector('.unit-relation__connector-top');
            this.bezierWeight = 0.7;
        }
        else if (this.options.isUnitToRelation) {
            this.srcHandle = this.src.$el.querySelector('.unit-info__connector-right') || this.src.$el.querySelector('.unit-relation__connector-right') || this.src.$el.querySelector('.unit-group__connector-right');
            this.destHandle = this.dest.$el.querySelector('.unit-relation__connector-left');
            this.bezierWeight = 0.7;
        }
        else if (this.options.isRelationToUnit) {
            this.srcHandle = this.src.$el.querySelector('.unit-relation__connector-right');
            this.destHandle = this.dest.$el.querySelector('.unit-info__connector-left') || this.dest.$el.querySelector('.unit-relation__connector-left') || this.dest.$el.querySelector('.unit-group__connector-left');
            this.bezierWeight = 0.7;
        }
        // TODO: It can be removed - not critical
        setInterval(() => {
            self.updateLine();
        }, 100);
    },
    data: function() {
        return {
            destHandle: null,
            srcHandle: null, 
            r: 0,
            bezierWeight: 0.625,
            srcX: 0,
            srcY: 0,
            destX: 0,
            destY: 0
        }
    },    
    methods: {
        updateLine() {
            this.$forceUpdate();
            this.r += 0.00000000000000001;// | (this.r);
            let point = this.$el.nextElementSibling.querySelector('.point');
            let px = this.x4, py = this.y4;
            point.style.transform = `translate3d(${px}px, ${py}px,0)`;
        },
        onclick(e) {
            e.preventDefault();
            e.stopPropagation();
            // this.x1 = e.clientX;
            // this.y1 = e.clientY;
            // let container = this.$el.nextElementSibling.getBoundingClientRect();
            let point = this.$el.nextElementSibling.querySelector('.point');
            let px = e.clientX , py = e.clientY ;
            point.style.transform = `translate3d(${px}px, ${py}px,0)`;
            console.log(px, py, this.$el.nextElementSibling);
            if (this.options.isRelationToUnit) {
                this.destHandle = point;
            }
            else if (this.options.isUnitToRelation) {
                this.srcHandle = point;
            }
        }
    },
    computed: {
        getComputedStyle() {
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

            if (this.srcHandle === null ) {
                x1 = this.srcX;
                y1 = this.srcY;
            } else if (this.destHandle === null) {
                y4 = this.destY;
                x4 = this.destX;
            }

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
                        y4 += dmy;
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
                c1x = this.x1 - this.dx -dmx;
                c1y = this.y1;
                c2x = this.x4 + this.dx
                c2y = this.y4;
                x4 = this.x4;
                y4 = this.y4;
                if (this.options.isRelationToUnit) {
                    x1 -= dmx;
                    c1x -= dmx;
                }
                if (this.options.isUnitToRelation) {
                    if (this.options.relationType === Constants.MANY_TO_MANY) {
                        x4 += dmx;
                        c2x += dmx;
                    }
                }
                    
            }
            if (!(x1&&y1&&c1x&&c1y&&c2x&&c2y&&c2y&&x4&&y4)) {
                console.log(`M ${x1} ${y1} C ${c1x} ${c1y} ${c2x} ${c2y} ${c2y} ${x4} ${y4}`);
            }

            return `M ${x1} ${y1} C ${c1x} ${c1y} ${c2x} ${c2y} ${x4} ${y4}`
        },
        getComputedMarkerStart() {
            if (this.options.relationType === Constants.ONE_TO_ONE && this.options.isRelationToUnit) {
                return 'url(#arrow1)'
            }
            if (this.options.relationType === Constants.MANY_TO_MANY) {
                return 'url(#black-arrow)'
            }
            if (this.options.relationType === Constants.ONE_TO_MANY) {
                return 'url(#black-arrow)'
            }
            return undefined;
        },
        getComputedMarkerEnd() {
            // if (this.options.relationType === Constants.ONE_TO_ONE) {
            //     return 'url(#arrow1)'
            // }
            if (this.options.relationType === Constants.MANY_TO_MANY) {
                return 'url(#black-arrow)'
            }
            if (this.options.relationType === Constants.ONE_TO_MANY) {
                return 'url(#black-arrow)'
            }
            return undefined;
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
                ...common
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
            type: Object
        },
        dest: {
            type: Object
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
    .line {
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
    }
</style>