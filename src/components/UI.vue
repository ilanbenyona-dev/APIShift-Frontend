<template>
  <div>
      <div id="from" draggable="true" @dragend="setpos($event, '#from')"></div>
      <div id="to"></div>
  </div>
</template>

<script>
export default {
    methods: {
        setpos (event, s) {
            const e = document.querySelector(s);

            let shiftX = event.clientX - e.getBoundingClientRect().left;
            let shiftY = event.clientY - e.getBoundingClientRect().top;

            e.style.left = event.pageX - shiftX + 'px';
            e.style.top = event.pageY - shiftY + 'px';
            console.log(e.style.left);
        }
    }
}
</script>

<style>

    #from,
    #to {
        position: absolute;
        font-size: 0px;
    }
    #from {
        left: 100px;
        top: 50px;
        width: 20px;
        height: 50px;
        background-color: green;
    }
    #to {
        left: 300px;
        top: 250px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: orange;
        z-index: 1;
    }
    .arrow {
        pointer-events: none;
        z-index: 2;
    }
    .arrow__path {
        stroke: blue;
        fill: transparent;
        stroke-dasharray: 8 4;
        stroke-width: 2;
    }
    .arrow__head line {
        stroke: red;
        stroke-width: 2px;
    }
</style>