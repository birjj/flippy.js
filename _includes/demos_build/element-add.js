"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var $column = document.querySelector(".adding-elements .column");

setInterval(addModule, 2000);

function addModule() {
    var $module = document.createElement("div");
    $module.classList.add("module");

    flip([$module].concat(_toConsumableArray(document.querySelectorAll(".adding-elements .module"))), function () {
        // add our new module to the column
        $column.insertBefore($module, $column.firstChild);
        // also remove the last module in the column
        $column.removeChild($column.lastElementChild);
    }, {
        duration: 600
    });
}