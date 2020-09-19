let getUnitbyId = function(id) {
    return document.querySelector('[data-id="'+id+'"]');
}

let getRelativeCoordinates = function (event, referenceElement) {        
    const position = {
        x: event.clientX,
        y: event.clientY
    };

    const offset = {
        left: referenceElement.offsetLeft,
        top: referenceElement.offsetTop
    };


    // let reference = referenceElement.offsetParent;

    // while(reference){
    //     offset.left += reference.offsetLeft;
    //     offset.top += reference.offsetTop;
    //     reference = reference.offsetParent;
    // }

    

    return { 
        x: position.x - offset.left,
        y: position.y - offset.top,
    }; 
}

// let relativeCoords = function ( event ) {
//     var bounds = event.target.getBoundingClientRect();
//     console.log(bounds);
//     var x = event.clientX - bounds.left;
//     var y = event.clientY - bounds.top;
    
//     console.log({x: x, y: y});
//     return {x: x, y: y};
// }
  

module.exports = {/*relativeCoords,*/getRelativeCoordinates,getUnitbyId};
