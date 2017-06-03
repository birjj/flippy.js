/**
 * Handler for a single element in a FLIP animation
 */
class FLIPElement {
    constructor(elm) {
        if (!(elm instanceof HTMLElement)) {
            throw new TypeError("Element must be an HTMLElement");
        }

        this.elm = elm;
    }

    /**
     * Snapshot an elements initial position
     * Stored in ._first
     */
    first() {
        this._first = snapshot(this.elm);
    }

    /**
     * Snapshot an elements final position
     * Stored in ._last
     */
    last() {
        this._last = snapshot(this.elm);
    }

    /**
     * Applies a transform from ._last => ._first
     * This moves the element back to where it was
     */
    invert() {
        let delta = getDelta(this._first, this._last);

        this.elm.style.transformOrigin = "50% 50%";
        this.elm.style.transform =
            `translate(${delta.left.toFixed(2)}px, ${delta.top.toFixed(2)}px)
             scale(${delta.width.toFixed(2)}, ${delta.height.toFixed(2)})
             ${this._first.transform}`;
        this.elm.style.opacity = this._first.opacity;

        this.elm.style.willChange = "transform,opacity";
    }

    /**
     * Plays back the animation
     */
    play() {
        this.elm.offsetHeight; // force reflow
        this.elm.style.transition = 
            `transform .4s linear, opacity .4s linear`;
        this.elm.offsetHeight; // force reflow
        this.elm.style.opacity = this._last.opacity;
        this.elm.style.transform = this._last.transform;
    }
}

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
    let pos = elm.getBoundingClientRect();
    let styles = window.getComputedStyle(elm);
    return { // positions are related to center
        left: pos.left + pos.width/2,
        top: pos.top + pos.height/2,
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

module.exports = FLIPElement;