"use strict";

var $module = document.querySelector(".listening-for-animation-end .module");
var index = -1;
var baseState = {
    left: "", top: "",
    right: "", bottom: "",
    transform: ""
};
var states = [{
    left: "50px", top: "50px",
    transform: "rotate(45deg)"
}, {
    left: "50px", bottom: "50px"
}, {
    right: "50px", bottom: "50px",
    transform: "scale(0.5)"
}, {
    top: "50px", right: "50px"
}];

function animate() {
    if (index === states.length - 1) {
        index = -1;
    }

    flip($module, function () {
        var state = states[++index];
        for (var prop in baseState) {
            if (state.hasOwnProperty(prop)) {
                $module.style[prop] = state[prop];
            } else {
                $module.style[prop] = baseState[prop];
            }
        }
    }).then(animate);
}
document.addEventListener("DOMContentLoaded", animate);