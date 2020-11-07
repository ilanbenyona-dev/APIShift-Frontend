<template>
  <div>
    <div class="dot"></div>
    <side-menu ref="sidemenu"></side-menu>
    <board ref="board"></board>
    <add-dialog ref="add-dialog"></add-dialog>
    <edit-relation ref="edit-relation"></edit-relation>
  </div>
</template>

<script>
import Board from './components/Board.vue';
import SideMenu from './components/SideMenu';
import AddDialog from './components/Modals/AddDialog';
import RelationModal from "./components/Modals/RelationModal";

window.addEventListener("wheel", function(e){e.preventDefault();}, {passive: false} );
window.addEventListener("touchstart", function(e){e.preventDefault()}, {passive:false})
export default {
  name: 'App',
  mounted: function() {
    window.addEventListener('scroll',(e) => {
      e.preventDefault();
    }, {passive: false});
    window.addEventListener('wheel',(e) => {
      e.preventDefault();
    }, {passive: false})
  },
  data: function () {
    return {
    }
  },
  components: {
    Board,
    'side-menu': SideMenu,
    'add-dialog': AddDialog,
    'edit-relation': RelationModal
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  -webkit-overflow-scrolling: touch;
}
body, html { height: 100%; }

body {  
    overflow: hidden;
    touch-action: none;
    -webkit-overflow-scrolling: touch;
}

#dot {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #f00;
    width: 5px;
    height: 5px;
    border-radius: 50%;

    z-index: 99999;
}

/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default padding */
ul[class],
ol[class] {
  padding: 0;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
ul[class],
ol[class],
li,
figure,
figcaption,
blockquote,
dl,
dd {
  margin: 0;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  scroll-behavior: smooth;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

/* Remove list styles on ul, ol elements with a class attribute */
ul[class],
ol[class] {
  list-style: none;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img {
  max-width: 100%;
  display: block;
}

/* Natural flow and rhythm in articles by default */
article > * + * {
  margin-top: 1em;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations and transitions for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
