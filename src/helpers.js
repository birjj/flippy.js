"use strict";

/**
 * Gets a snapshot of an element
 * Returns an object with format
 * {
 *   left: <Number>, top: <Number>,
 *   width: <Number>, height: <Number>,
 *   transform: <String>
 * }
 */
export function getSnapshot(elm) {
    let pos = getClientRect(elm);
    let styles = window.getComputedStyle(elm);
    return { // positions are related to center
        left: pos.left + pos.width/2,
        top: pos.top + pos.height/2,
        width: pos.width,
        height: pos.height,
        
        transform: styles.transform === "none" || !styles.transform ?
                        "" : styles.transform
    };
}

/**
 * Gets the difference between two snapshots
 * Width/height are scales, left/top are pixel differences
 */
export function getDelta(alpha, beta) {
    let delta = {
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

/**
 * Returns the client rectangle of an element w/o transforms
 */
export function getClientRect(elm) {
    let rect = {
        width: elm.offsetWidth,
        height: elm.offsetHeight,
        left: elm.offsetLeft,
        top: elm.offsetTop
    };
    let _isFixed = window.getComputedStyle(elm).position === "fixed";

    // offsetLeft/-Top relates to the offsetParent
    // we want it to relate to the window
    while ((elm = elm.offsetParent) && elm !== document.body
                                    && elm !== document.documentElement) {
        rect.left += elm.offsetLeft;
        rect.top += elm.offsetTop;
    }

    // fixed elements have .offsetParent === body
    if (_isFixed) {
        let doc = document.documentElement;
        rect.left += (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        rect.top += (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    }

    return rect;
}

/**
 * Turns an option object into a transition string
 */
export function getTransitionString(options) {
    let dur = options.duration/1000;
    return `transform ${dur.toFixed(2)}s ${options.ease}`;
}