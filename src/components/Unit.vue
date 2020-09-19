<template>
        <div class="unit draggable">
            <slot></slot>
        </div>
</template>

<script>
export default {
    methods: {

    }
}
</script>

<style scoped>
    .unit {
        position: absolute;
    height: 120px; 
    width: 120px; 
    overflow: hidden; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    background-color: rgb(255, 255, 255); 
    border-width: 3px; 
    border-style: solid;
    border-color: rgb(66, 178, 253); 
    border-radius: 12px;
    box-shadow: rgba(40, 60, 75, 0.15) 0px 3px 6px;
    transition: transfrom .2s ease-in-out;
    transition: box-shadow .2s ease-in-out;

    }
    .unit:active {
        transform: scale(1.1);
        box-shadow: rgba(40, 60, 75, 0.35) 0px 29px 60px;
    }
    .unit:hover {
      cursor: pointer;
      border-width: 5px;
    }
</style>