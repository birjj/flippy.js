"use strict";

var $elm = document.getElementById("flexbox-columns-movable");
var $parents = [".flexbox-columns", ".flexbox-columns .column:nth-child(2)"].map(function (elm) {
    return document.querySelector(elm);
});

$elm.addEventListener("click", function () {
    // when the element is clicked, animate the move
    flip(".flexbox-columns .module", // elements to animate
    function () {
        // function which makes the DOM change
        var $parent = $parents[0];
        if ($elm.parentNode === $parents[0]) {
            $parent = $parents[1];
        }
        $parent.insertBefore($elm, $parent.firstChild);
    }, { // options object
        ease: "cubic-bezier(0.4, 2.2, 0.5, 0.7)"
    });
});