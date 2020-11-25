<template>
  <circle class="point" :cx="left" :cy="top" :r="getComputedRadius"/>
</template>

<script>
export default {
    data: function() {
        return {
            left: 0,
            top: 0,
            scale: 1
        }
    },
    computed: {
        getComputedRadius() {
            return 5*this.scale;
        }
    }
}
</script>

<style lang="scss" scoped>
    .point {
        cursor: pointer;
        opacity: 0.5;
    }
</style>