"use strict";

var $toggle = document.getElementById("flip-toggle");
if ($toggle) {
    var toggleFLIP = function () {
        var _flip = flip;
        var _noflip = function _noflip(elms, modifier) {
            return new Promise(function (res, rej) {
                modifier();
                setTimeout(res, 400);
            });
        };
        return function toggleFLIP(value) {
            if (value) {
                flip = _flip;
            } else {
                flip = _noflip;
            }
        };
    }();
    toggleFLIP($toggle.checked);
    $toggle.addEventListener("change", function () {
        toggleFLIP($toggle.checked);
    });
}