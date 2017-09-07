"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tab = function () {
    /** @param {HTMLElement} $elm */
    function Tab($elm) {
        var _this = this;

        _classCallCheck(this, Tab);

        this.$elm = $elm;
        this.$parent = $elm.parentNode;
        this.$active = Array.from($elm.children).filter(function ($tab) {
            return $tab.hasAttribute("tab-active");
        })[0];

        $elm.addEventListener("click", function (e) {
            if (e.target.parentNode === _this.$elm) {
                if (e.target === _this.$active) {
                    return;
                }
                _this.setActiveTab(e.target);
            }
        });
        this.setActiveTab(this.$active);

        var $targets = Array.from($elm.children).map(function ($tab) {
            return _this.getTarget($tab);
        });
        var _minHeight = $targets.reduce(function (p, $target) {
            return Math.max(p, $target.clientHeight);
        }, 0);
        $targets.forEach(function ($target) {
            return $target.style.minHeight = _minHeight.toFixed(2) + "px";
        });
    }

    /** @param {HTMLElement} $tab */


    _createClass(Tab, [{
        key: "setActiveTab",
        value: function setActiveTab($tab) {
            this.$active.removeAttribute("tab-active");
            this.getTarget(this.$active).style.display = "none";
            this.$active = $tab;
            $tab.setAttribute("tab-active", "true");
            this.getTarget($tab).style.display = "block";
        }

        /** @param {HTMLElement} $tab */

    }, {
        key: "getTarget",
        value: function getTarget($tab) {
            var target = $tab.getAttribute("tab-target");
            var $target = this.$parent.querySelector(target);
            return $target;
        }
    }]);

    return Tab;
}();

Array.from(document.getElementsByClassName("tabs")).map(function ($tab) {
    return new Tab($tab);
});