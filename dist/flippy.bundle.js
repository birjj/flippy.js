(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["flip"] = factory();
	else
		root["flip"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * FLIP animation helper
 * See https://aerotwist.com/blog/flip-your-animations/
 *
 * Animation principle by Paul Lewis
 * Code by Birjolaxew
 */



var FLIPElement = __webpack_require__(2);

/**
 * Animates DOM changes on specified elements
 * @param {Element|Array<Element>|String} elms  Element(s) to animate
 * @param {Function} modifier   Is called when the DOM should change
 * @param {Object} [options]    Various additional options
 * @param {Function} [options.callback] A function to be called when animation
 *                                      is done. Receives elms as parameter.
 * @param {Number} [options.duration]   The length of the animation in seconds.
 * 
 * @return {Promise<elms>}  A Promise which resolves once animation is done.
 */
module.exports = function flip(elms, modifier, options) {
    if (!elms || typeof elms !== "string" && !(elms instanceof Array) && !(elms instanceof HTMLElement)) {
        throw new TypeError("Elements must be a string, array or element");
    }
    if (!modifier || !(modifier instanceof Function)) {
        throw new TypeError("Modifier must be a function");
    }
};

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Handler for a single element in a FLIP animation
 */
var FLIPElement = function () {
    function FLIPElement(elm) {
        _classCallCheck(this, FLIPElement);

        if (!(elm instanceof HTMLElement)) {
            throw new TypeError("Element must be an HTMLElement");
        }

        this.elm = elm;
    }

    /**
     * Snapshot an elements initial position
     * Stored in ._first
     */


    _createClass(FLIPElement, [{
        key: "first",
        value: function first() {
            this._first = snapshot(this.elm);
        }

        /**
         * Snapshot an elements final position
         * Stored in ._last
         */

    }, {
        key: "last",
        value: function last() {
            this._last = snapshot(this.elm);
        }

        /**
         * Applies a transform from ._last => ._first
         * This moves the element back to where it was
         */

    }, {
        key: "invert",
        value: function invert() {
            var delta = getDelta(this._first, this._last);

            this.elm.style.transformOrigin = "50% 50%";
            this.elm.style.transform = "translate(" + delta.left.toFixed(2) + "px, " + delta.top.toFixed(2) + "px)\n             scale(" + delta.width.toFixed(2) + ", " + delta.height.toFixed(2) + ")\n             " + this._first.transform;
            this.elm.style.opacity = this._first.opacity;

            this.elm.style.willChange = "transform,opacity";
        }

        /**
         * Plays back the animation
         */

    }, {
        key: "play",
        value: function play() {
            this.elm.offsetHeight; // force reflow
            this.elm.style.transition = "transform .4s linear, opacity .4s linear";
            this.elm.offsetHeight; // force reflow
            this.elm.style.opacity = this._last.opacity;
            this.elm.style.transform = this._last.transform;
        }
    }]);

    return FLIPElement;
}();

/**
 * Gets a snapshot of an element
 * Returns an object with format
 * {
 *   left: <Number>, top: <Number>,
 *   width: <Number>, height: <Number>,
 *   opacity: <Number>,
 *   transform: <String>
 * }
 */


function snapshot(elm) {
    var pos = elm.getBoundingClientRect();
    var styles = window.getComputedStyle(elm);
    return { // positions are related to center
        left: pos.left + pos.width / 2,
        top: pos.top + pos.height / 2,
        width: pos.width,
        height: pos.height,

        opacity: parseFloat(styles.opacity),
        transform: styles.transform === "none" ? "" : styles.trasnform
    };
}

/**
 * Gets the difference between two snapshots
 * Width/height are scales, left/top are pixel differences
 */
function getDelta(alpha, beta) {
    var delta = {
        left: alpha.left - beta.left,
        top: alpha.top - beta.top,
        width: alpha.width / beta.width,
        height: alpha.height / beta.height
    };

    if (alpha.width === 0 && alpha.height === 0) {
        // the element probably wasn't in the DOM at the time
        // don't animate left/top
        delta.left = delta.top = 0;
    }

    return delta;
}

module.exports = FLIPElement;

/***/ })
/******/ ]);
});