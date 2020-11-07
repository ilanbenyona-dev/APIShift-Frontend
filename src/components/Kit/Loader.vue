<template>
    <div class="loader"></div>
    <div class="loader-background"></div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .loader {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border: 7px solid #f3f3f3;
        border-radius: 50%;
        border-top: 7px solid #3498db;
        width: 35px;
        height: 35px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
        z-index: 9999;

        &-background {
            position: fixed;
            height: 100vh;
            width: 100vw;
            top: 0;
            left: 0;
            background-color: rgba($color: #ffffff, $alpha: 1);
            z-index: 9998;
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    /* Safari */
    @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
    }
</style>