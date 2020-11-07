export default {
    methods: {
        handleEditLogic: function (){
            this.text = this.unit.getText();
            if(!this.text) {
                this.editmode = true;
                // /* Focus editable div */
                // let input = this.$el.querySelector('.input');
                // input.focus();
            }
        },
        keydown(e) {
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
        }
    }
}