<template>
  <div class="dropdown">
      <div class="dropdown__item">
        <div class="dropdown__item-type"></div>
        <div class="dropdown__item-name"></div>
      </div>
      <div class="dropdown-indicator"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .dropdown {
        display: inline-block;
        width: 120px;
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
            // width: 200px;
            
        }
        .dropdown-indicator {
            
        }
    
    }
</style>