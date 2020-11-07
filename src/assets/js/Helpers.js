
let Helpers = {
    // Function that generates short UID as "aX4j9Z"
    generateUID: () => {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    },
    /**
     * Gets computed translate values
     * @param {HTMLElement} element
     * @returns {Object}
     */
    getTranslateValues: function (element) {
        const style = window.getComputedStyle(element)
        const matrix = style['transform'] || style.webkitTransform || style.mozTransform

        // No transform property. Simply return 0 values.
        if (matrix === 'none') {
            return {
            x: 0,
            y: 0,
            z: 0
            }
        }

        // Can either be 2d or 3d transform
        const matrixType = matrix.includes('3d') ? '3d' : '2d'
        const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')

        // 2d matrices have 6 values
        // Last 2 values are X and Y.
        // 2d matrices does not have Z value.
        if (matrixType === '2d') {
            return {
            x: parseInt(matrixValues[4],10),
            y: parseInt(matrixValues[5],10),
            z: parseInt(0, 10)
            }
        }

        // 3d matrices have 16 values
        // The 13th, 14th, and 15th values are X, Y, and Z
        if (matrixType === '3d') {
            return {
            x: parseInt(matrixValues[12],10),
            y: parseInt(matrixValues[13],10),
            z: parseInt(matrixValues[14],10)
            }
        }
    },
    /**
     * Test whether element1 collides with element2 with spesific threshold
     * @param {HTMLElement} element1, @param {HTMLElement} element2, @param {HTMLElement} threshold
     * @returns {Boolean} 
     */
    hitTest: function(element1, element2, threshold){
        var rect1 = element1.getBoundingClientRect();
        var rect2 = element2.getBoundingClientRect();

        var xOverlap = Math.max(0, Math.min(rect1.right , rect2.right) - Math.max(rect1.left, rect2.left));
        var yOverlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));

        return  (xOverlap * yOverlap) > (element1.offsetHeight * element1.offsetWidth) * (1 - threshold);
    },

    /* https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    * Recommended reading
    */
    // animateUnit: function(unit,destX,destY, duration) {
    //     let start = performance.now();
    //     let startX = unit.left; startY=unit.top;

    //     let animate = function(time) {
    //         // timeFraction goes from 0 to 1
    //         let timeFraction = (time - start) / duration;
    //         if (timeFraction > 1) timeFraction = 1;
        
    //         // calculate the current animation state
    //         let progress = timing(timeFraction)
        
    //         unit.left = startX+progress*100;
    //         unit.top = startY+progress*100;
        
    //         if (timeFraction < 1) {
    //             requestAnimationFrame(animate);
    //         }
        
    //     }
    //     requestAnimationFrame(animate);
    // }
}

let Constants = {
    ONE_TO_ONE: 1,
    ONE_TO_MANY: 2,
    MANY_TO_MANY: 3,
    LEADERLINE_SIZE: 5
}



export { Helpers, Constants };