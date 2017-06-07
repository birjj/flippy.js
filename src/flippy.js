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
 * @param {Number} [options.duration=400] The length of the animation in milliseconds.
 * @param {String} [options.ease="ease"] The CSS timing function to use
 * @param {String} [options.animatingClass="flip-animating"]
 * @param {String} [options.scalingClass="flip-scaling"]
 * 
 * @return {Promise<Array<Element>>}    A Promise which resolves once animation 
 *                                      is done.
 */
export default function flip(elms, modifier, options={}){
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

    // then FLIP
    elms.forEach(elm=>elm.first());
    modifier();
    elms.forEach(elm=>elm.last().invert().play());

    if (options.debug && console.groupCollapsed) {
        console.groupEnd();
    }

    // return a Promise
    return finalPromise;
}
flip.FLIPElement = FLIPElement;