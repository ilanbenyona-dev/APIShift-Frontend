<template>
  <div class="dropdown">
      <!-- <img src="../assets/right-arrow.png" alt="" srcset=""> -->
      <div class="dropdown__item">
        <div class="dropdown__item-type">R</div>
        <div class="dropdown__item-name">UserPosts</div>
      </div>
      <div class="dropdown-indicator"></div>
  </div>
</template>

<script>
export default {
  props: {
    itemList: {
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
    .dropdown {
        display: inline-block;
        width: 140px;
        height: 30px;
        background: white;
        border-bottom: 1px solid black;
        margin-top: -5px;
        cursor: pointer;

        &.active {

          .dropdown__item:not(:first-of-type) {
            
          }
        }
        .dropdown__item {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            line-height: 30px;

            &-type {
              height: 22px;
              width: 22px;
              border: 1px solid black;
              border-radius: 50px;
              margin-top: auto;
              margin-bottom: auto;
              line-height: 22px;
              // letter-spacing: 20px;
            }
            &-name {
              margin-right: 35px;
              margin-left: 0;
            }
            
        }
        .dropdown-indicator {
            
        }
    
    }
</style>