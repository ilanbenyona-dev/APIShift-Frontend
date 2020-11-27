<template>
  <div class="dropdown">
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
        border: 1px solid black;
        border-radius: 5px;
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

            &-name {
              margin-right: 20px;
            }
            
        }
        .dropdown-indicator {
            
        }
    
    }
</style>