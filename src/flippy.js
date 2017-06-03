/**
 * FLIP animation helper
 * See https://aerotwist.com/blog/flip-your-animations/
 *
 * Animation principle by Paul Lewis
 * Code by Birjolaxew
 */

"use strict";
import FLIPElement from "./element";

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
module.exports = function flip(elms, modifier, options){
    if (!elms || (typeof elms !== "string"
                  && !(elms instanceof Array)
                  && !(elms instanceof HTMLElement))) {
        throw new TypeError("Elements must be a string, array or element");
    }
    if (!modifier || !(modifier instanceof Function)) {
        throw new TypeError("Modifier must be a function");
    }

    // TODO: implement handlers for strings & arrays
    let elm = new FLIPElement(elms);
    elm.first();
    modifier();
    elm.last()
       .invert()
       .play();
};