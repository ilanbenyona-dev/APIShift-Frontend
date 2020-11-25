<template>
    <div v-show="isModalActive">
        <div class="modal-shadow"></div>
        <div class="modal">
            <div class="modal__header">Edit relation</div>
            <div class="modal__body">
                <div class="modal__body__edit">
                  <div class="modal__body__edit-from">
                    <div class="label">From:</div>
                    <drop-down-units></drop-down-units>
                  </div>
                  <div class="modal__body__edit-to">
                    <div class="label">To:</div>
                    <drop-down-units></drop-down-units>
                  </div>
                  <div class="modal__body__edit-name">
                    <div class="modal__body__edit-name-key">
                        Name:
                    </div>
                    <input v-model="text" :class="{'nonempty': text.length>0}"
                        class="modal__body__edit-name-value single-line input">
                  </div>
                </div>
                <item-builder :itemName="text">{{text}}</item-builder>
            </div>
        </div>
    </div>
</template>

<script>
import ItemBulider from './ItemBuilder';
import DropDownUnits from './DropDownUnits';

export default { 
    components: {
        'item-builder': ItemBulider,
        'drop-down-units': DropDownUnits
    },
    data: function() {
        return {
            text: '',
            editmode: true,
            isModalActive: false, // Can be changed from outside,
            clickListener: null
        }
    },
    methods: {
        handleEditLogic: function (){
            if(!this.text) {
                this.editmode = true;
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
    },
    mounted: function() {
        let self = this;
        let shadow = self.$el.querySelector('.modal-shadow');

        let disableShadow = () =>{
            self.isModalActive = false;
        }

        // if (isModalActive) {
        //     this.clickListener = shadow.addEventListener('pointerdown', disableShadow);
        // } else {
        //     shadow.removeEventListener('pointerdown', disableShadow);
        // }

        this.clickListener = shadow.addEventListener('pointerdown', disableShadow);

        console.log(this.clickListener);
    },
}
</script>

<style lang="scss" scoped>
    .modal {
        &-shadow {
            position: fixed;
            z-index: 9999;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .5);
            transition: opacity 0.5s ease;
        }
        position: fixed;
        z-index: 9999;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        height: 600px;
        width: 500px;
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 2px;
        border-top-left-radius: 25px;
        border-top-right-radius: 25px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: opacity 0.5s ease;

        &__header {
            position: relative;
            width: 100%;
            height: 60px;
            left: 0;
            top: 0;
            background: rgba(66, 178, 253,0.7);
            border-top-left-radius: 25px;
            border-top-right-radius: 25px;
            border-bottom: 1.2px solid white;
            text-align: center;
            vertical-align: middle;
            line-height: 60px; 
            color: rgb(46, 46, 46);
            text-transform: uppercase;
            font-weight: 800;
            font-size: 24px;

            &:before, &:after{
                position: absolute;
                left: 0;
                top: 0;
                height: 60px;
                width: 100%;;
                background-color: black;
            }
            // text-align: ;
        }

        &__body {
            // height: 60px;
            // width: 100%;

            .label {
              margin-right: 0;
            }
            &__edit  {
              display: grid;
              grid-template-columns: 25% 25% 25% 25%;
              grid-template-rows: 25% 25% 25% 25%;
              margin-top: 20px;
              &-from {
                display: flex;
                flex-direction: row;
                // justify-content: space-between;
                // min-width: 200px;
                grid-column-start: 1; 
                grid-column-end: 3;
                grid-row-start: 1;
                margin-left: 50px;
                margin-right: 20px;
                .label {
                  margin-right: 10px;
                  font-weight: 600;
                  text-transform: uppercase;
                }
              }
              &-to {
                display: flex;
                flex-direction: row;
                // justify-content: space-between;
                grid-column-start: 3;
                grid-column-end: 5;
                grid-row-start: 0;
                margin-left: 40px;
                margin-right: 20px;
                
                .label {
                  margin-right: 10px;
                  font-weight: 600;
                  text-transform: uppercase;
                }
              }


              &-name {
                // height: 60px;
                // width: 60px;
                margin: auto;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                line-height: 105px;

                grid-column-start: 2;
                grid-row-start: 2;

                &-key {
                    order: 0;
                    height: 100%;
                    min-width: 50px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                &-value {
                    order: 1;
                    height: 50%;
                    // min-width: 200px;
                    margin-top: 30px;
                    text-align: right;
                    padding-right: 3px;
                    font-weight: 500;
                    outline: none;
                    border: none;
                    line-height: 1000px;
                    border-bottom: 1px dashed black;
                    // animation: blink .5s step-end infinite alternate;

                    &:focus {
                        border-bottom: 1px solid black;
                    }

                    &.nonempty {
                        border-bottom: 1px solid black;
                        animation: none;
                    }
                }
            }
            }

        }

        @keyframes blink { 
            50% { border-color: black; } 
        }
    }
</style>