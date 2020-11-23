

export default {
    mounted: function() {
        let self = this;

        /* Every unit element has a ref attribute in the DOM as a unique id */
        this.$el.ref = this.unit.getUID();
        this.text = this.unit.getText();

        const isEditableUnit =  {
            "Type": true,
            "Enum": true,
            "Group": true,
            "Relation": true,
            "Info": true
        }[this.unit.getType()];
        if (isEditableUnit ) {
            this.$el.querySelector('.input').addEventListener('blur', () => {
                self.isGhost = false;
            });
        }
        this.isEditableUnit =  isEditableUnit;
    },
    methods: {
        /* Move unit */
        moveBy: function(dx,dy) { 
            this.left += dx;
            this.top += dy;
        },
        internalScaleTo: function(cx, cy, scaleBy) {
            this.scale *=scaleBy;

            if (cx != -1 && cy != -1) {
                this.left = (this.left * scaleBy + (cx) * (1-scaleBy));
                this.top = (this.top * scaleBy + (cy) * (1-scaleBy));   
            }
            this.updateLines();
        },
        handleEditLogic: function (){
            if (!this.isEditableUnit) {
                return; 
            }
            this.text = this.unit.getText();
            if(!this.text) {
                this.editmode = true;
            }
        },
        keydown(e) {
            if (!this.isEditableUnit) {
                return; 
            }
            e.stopPropagation();
            const isControlKey = {
                "ArrowLeft"  : true,
                "ArrowRight" : true,
                "ArrowUp"    : true,
                "ArrowDown"  : true,
                "Space" : true,
                "Backspace" : true,
            }[e.code]
            if(!isControlKey && !e.key.match(/^[\d\w]$/i)) {
                e.preventDefault();
                if (e.code === "Enter") {
                    this.editmode = false;
                }
                this.text = this.$el.querySelector('.input').innerText;
            }
        },
        /* position attached lines */
        updateLines() {
            let board = this.$parent;
            for (const lineId of this.lines) {
                if (board.$refs[lineId]) {
                    board.$refs[lineId].updateLine();
                }
            }
        },
        pushLine(lineId) {
            this.lines.push(lineId);
        },
        removeLine(lineId) {
            this.lines = this.lines.filter((l) => {
                if (l !== lineId) {
                    return l;
                }
            });
        },
        findLine(lineId) {
            return this.lines.find((l) => {l === lineId});
        },
        /* Unit methods */
        getUnit: function() {
            return this.unit;
        }
    },
    computed: {
        getText: function() {
            return this.unit.getText();
        },
        transformation () {
            return {
                transform: `translate3d(${this.left}px,${this.top}px, 0) scale(${this.scale})`,
                // zIndex: this.zIndex,
                fontSize: 13+ 'px'
            }
        }
    },
    data: function() {
        return {
            // Functional data  
            left: 0,
            top: 0,
            scale: 1,
            lines: [],
            groupContainer: null,
            isEditableUnit: false,
            // Plain component data
            text: '',
            editmode: false,
            // UI data
            isGhost: false
        }
    },
    props: 
    {
        unit: {
            type: Object
        },
        zIndex: {
            type: Number
        },
        boardRendered: {
            type: Boolean
        }
    },
    watch: {
        left: function(newLeft) {
            /* Move element on data level */
            this.unit.setX(newLeft);
        
            this.updateLines();
        },
        top: function(newTop) {
            /* Move element on data level */
            this.unit.setY(newTop);
        
            this.updateLines();
        },
        editmode: function(mode) {
            if (!this.isEditableUnit) {
                return; 
            }
            if(mode) {
                /* Focus editable div */
                let input = this.$el.querySelector('.input');
                input.focus();
            } else {
                /* Blur editable div */
                this.$el.blur();
                this.isGhost = false;
            }

        },
        text: function() {
            this.unit.setText(this.text);
        },
        isGhost: function(isghost) {
            if (isghost) {
                let boardOffset = document.querySelector('#board').getBoundingClientRect();
                this.left -= (this.$el.getBoundingClientRect().width)/2 - boardOffset.left;
                this.top -= (this.$el.getBoundingClientRect().height)/2 - boardOffset.top;
                this.editmode = true;
                
                this.$el.style.zIndex = this.zIndex+1;
            }
            else  {
                this.editmode = false;
                this.$el.classList.remove('isghost');
            }
        },
        groupContainer: function() {
            // this.groupContainer.setHeightAndWidth();
        }
    }
}
