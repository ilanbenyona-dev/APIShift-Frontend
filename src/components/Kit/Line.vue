<template>
    <svg xmlns="http://www.w3.org/2000/svg" 
  xmlns:xlink="http://www.w3.org/1999/xlink" class="svg">
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

        <template >
            <marker id="black-arrow" markerWidth="5" markerHeight="5" refX="0" refY="400"
            viewBox="0 0 10 10" orient="auto-start-reverse" style="opacity: 0.85">
                <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <marker id="arrow1" viewBox="0 0 492.004 492.004" markerWidth="5" markerHeight="5" refX="285" refY="246" orient="auto-start-reverse" >
                <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"/>
            </marker>
        </template>
    </defs>

    <!-- Info-to-Enum dashed line -->


        <path
        :marker-start="getComputedMarkerStart"
        :marker-end="getComputedMarkerEnd"
        :style="getComputedStyle"  
        class="line" 
        :d="getComputedPath"></path>
    </svg>
</template>

<script>
import { Constants } from '../../assets/js/Helpers';

export default {
    mounted: function() {
        let self = this;

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
            bezierWeight: 0.625
        }
    },    
    methods: {
        updateLine() {
            this.$forceUpdate();
            this.r += 0.00000000000000001// | (this.r);
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
        x1: function(x1) {
            if (x1 === -1) {
                this.$parent.deleteLineOnRuntime(this.line.id);
            }
        },
        x2: function(y1) {
            if (y1 === -1) {
                this.$parent.deleteLineOnRuntime(this.line.id);
            }
        }
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

<style scoped>
    .svg {
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    z-index: -1;
    }

    .line {
    fill: none;
    stroke: dodgerblue;
    stroke-width: 6;
    }
</style>