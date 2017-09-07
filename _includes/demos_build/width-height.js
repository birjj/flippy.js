"use strict";

function createFlipElm(elm) {
    return new flip.FLIPElement(elm, {
        duration: 1000,
        useScale: false
    });
}
var $elm = document.querySelector(".animating-width-and-height-instead-of-scale .module");
var _elm = void 0;
$elm.addEventListener("click", function () {
    _elm = _elm || createFlipElm($elm);
    _elm.first();
    $elm.classList.toggle("open");
    _elm.last().invert().play();
});