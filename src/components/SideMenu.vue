<template>
  <div class="side-menu">
      <div class="side-menu__container">
        <div @click="addItem">
            <img src="../assets/add.png" alt="">
        </div>
        <div @click="addRelation">
            <img src="../assets/right-arrow.png" alt="">
        </div>
        <div @click="deleteItem">
            <img src="../assets/eraser.png" alt="">
        </div>
        <div @click="addEnum">
            <img src="../assets/e.png" alt="">
        </div>
        <div @click="addType">
            <img src="../assets/t.png" alt="">
        </div>
        <div @click="addGroup">
            <img src="../assets/g.png" alt="">
        </div>
      </div>
  </div>
</template>

<script>
import { Relation, } from "../assets/js/unit-classes";
import { Constants } from "../assets/js/Helpers";

export default {
    methods: {
        addItem: function() {
            // const width  = window.innerWidth || document.documentElement.clientWidth || 
            // document.body.clientWidth;
            // const height = window.innerHeight|| document.documentElement.clientHeight|| 
            // document.body.clientHeight;

            // let offsetTop = (height/(2) - this.$parent.$refs.board.$el.getBoundingClientRect().top);
            // let offsetLeft = (width/(2) - this.$parent.$refs.board.$el.getBoundingClientRect().left);
            // let scale = this.$parent.$refs.board.getScale();

            // offsetTop /= scale*scale;
            // offsetLeft /= scale*scale;

            // if (offsetLeft < 0 || offsetTop < 0) {
            //     alert(`(${offsetLeft},${offsetTop}) not in range`);
            // }

            // let unit = new Type(offsetLeft,offsetTop, "");
            //
            this.$parent.$refs['add-dialog'].isModalActive=true;
        },
        deleteItem: function() {
            let board = this.$parent.$refs.board;
            console.log(board);
            if (board) {
                board.cursor = 'delete';
            }
        },
        addRelation: function() {
            let selectedUnits = this.$parent.$refs.board.getSelectedUnits();
            let src = selectedUnits[0];
            let dest = selectedUnits[1];

            if (!(src&&dest)) {
                alert('2.11.2020');
                return;
            }
            let relation = new Relation(src, dest, Constants.ONE_TO_ONE, "UserPosts");
            this.$parent.$refs.board.addUnitOnRuntime(relation);
        },
        addEnum: async function() {
            let board = this.$parent.$refs.board;
            board.cursor = 'addEnum';
        },
        addType: async function() {
            let board = this.$parent.$refs.board;
            board.cursor = 'addType';
        },
        addGroup: function () {
            let board = this.$parent.$refs.board;
            board.cursor = 'addGroup';
        }
    }
}
</script>

<style lang="scss" scoped>
    .side-menu {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
        height: 100%;
        background-color: white;
        border-right: 1px solid black;
        z-index: 9999;

        &__container {
            margin: auto;
            margin-top: 3px;
            // border-top: 2px solid black;
            justify-self: center;
            div {
                display: flex;
                background: white;
                border: 1px solid black;
                line-height: 5rem;
                text-align: center;
                padding: 10px;
                cursor:pointer;

                img {
                    height: 40px;
                    width: 40px;
                }
            }
        }
    }
</style>