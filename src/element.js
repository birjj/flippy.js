import { snapshot, getDelta } from "./helpers";

/**
 * Handler for a single element in a FLIP animation
 */
export default class FLIPElement {
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
        this.debug("first", this._first);

        return this;
    }

    /**
     * Snapshot an elements final position
     * Stored in ._last
     */
    last() {
        this._last = snapshot(this.elm);
        this.debug("last", this._last);

        return this;
    }

    /**
     * Applies a transform from ._last => ._first
     * This moves the element back to where it was
     */
    invert() {
        let delta = getDelta(this._first, this._last);

        this.elm.style.transformOrigin = "50% 50%";
        // if the original transform contains rotates, we need to move first
        // (so it moves along the non-rotated axis) and scale last (so it scales
        // along the rotated axis)
        this.elm.style.transform =
            `translate(${delta.left.toFixed(2)}px, ${delta.top.toFixed(2)}px)
             ${this._first.transform}
             scale(${delta.width.toFixed(2)}, ${delta.height.toFixed(2)})`;
        this.elm.style.opacity = this._first.opacity;

        this.elm.style.willChange = "transform,opacity";

        this.debug("invert",delta);

        return this;
    }

    /**
     * Plays back the animation
     */
    play() {
        // we wait a frame instead of forcing a reflow
        requestAnimationFrame(()=>{
            this.elm.style.transition = 
                `transform .4s ease, opacity .4s linear`;
            requestAnimationFrame(()=>{
                this.elm.style.opacity = this._last.opacity;
                this.elm.style.transform = this._last.transform;
            });
        });

        return this;
    }

    /**
     * Logs debug info
     */
    debug(method, meta) {
        // console.log("[",this.elm,"] ",method,meta);
    }
}