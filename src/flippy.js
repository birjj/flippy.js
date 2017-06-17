/**
 * FLIP animation helper
 * See https://aerotwist.com/blog/flip-your-animations/
 *
 * Animation principle by Paul Lewis
 * Code by Birjolaxew
 */

"use strict";
// cannot use import/export because of webpack/webpack#706
const FLIPElement = require("./element.js").default;

/**
 * Animates DOM changes on specified elements
 * @param {Element|Array<Element>|String} elms  Element(s) to animate
 * @param {Function} modifier   Is called when the DOM should change
 * @param {Object} [options]    Various additional options
 * @param {Function} [options.callback] A function to be called when animation
 *                                      is done. Receives elms as parameter.
 * @param {Number} [options.duration=400] The length of the animation in milliseconds.
 * @param {String} [options.ease="ease"] The CSS timing function to use
 * @param {String} [options.animatingClass="flip-animating"]
 * @param {String} [options.scalingClass="flip-scaling"]
 * 
 * @return {Promise<Array<Element>>}    A Promise which resolves once animation 
 *                                      is done.
 */
module.exports = function flip(elms, modifier, options={}){
    if (!elms || (typeof elms !== "string"
                  && !(elms instanceof Array)
                  && !(elms instanceof HTMLElement))) {
        throw new TypeError("Elements must be a string, array or element");
    }
    if (!modifier || !(modifier instanceof Function)) {
        throw new TypeError("Modifier must be a function");
    }

    // normalize all input types to {Array<Element>}
    if (typeof elms === "string") {
        elms = Array.from(document.querySelectorAll(elms));
    } else if (elms instanceof HTMLElement) {
        elms = [elms];
    }

    if (options.debug && console.groupCollapsed) {
        console.groupCollapsed();
    }

    // make our callback a collective callback
    let finalCallback;
    let finalPromise = new Promise(res=>{
        finalCallback = ()=>{
            if (optCallback) {
                optCallback();
            }
            res();
        };
    });
    let optCallback = options.callback;
    let numCalls = elms.length;
    options.callback = ()=>{
        if (--numCalls <= 0) {
            finalCallback();
        }
    };

    // convert to {Array<FLIPElement>}
    elms = elms.map(elm=>{
        if (!(elm instanceof HTMLElement)) {
            throw new TypeError("Array must only contain elements");
        }
        return new FLIPElement(elm, options);
    });

    // ===
    // FLIP elements
    // ===
    elms.forEach(elm=>elm.first()); // reflow: read
    modifier(); // reflow: write
    elms.forEach(elm=>elm.last()); // reflow: read
    elms.forEach(elm=>elm.invert()); // reflow: write
    elms = elms.map(elm=>{ // reflow: write
        if (elm._playPart1() === false) {
            options.callback();
            return false;
        }
        return elm;
    }).filter(Boolean);
    document.body.offsetTop; // force reflow
    elms.forEach(elm=>elm._applyTransition()); // reflow: write
    document.body.offsetTop; // force reflow
    elms.forEach(elm=>elm._playPart2());

    if (options.debug && console.groupCollapsed) {
        console.groupEnd();
    }

    // return a Promise
    return finalPromise;
};
module.exports.FLIPElement = FLIPElement;