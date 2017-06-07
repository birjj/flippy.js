import { getSnapshot, getDelta, getTransitionString } from "./helpers";

/**
 * Handler for a single element in a FLIP animation
 */
export default class FLIPElement {
    constructor(elm, options) {
        if (!(elm instanceof HTMLElement)) {
            throw new TypeError("Element must be an HTMLElement");
        }

        // apply defaults
        options = Object.assign({}, {
            duration: 0.4,
            ease: "ease",
            animatingClass: "flip-animating",
            scalingClass: "flip-scaling"
        }, options);

        this.elm = elm;
        this.opts = options;
    }

    /**
     * Snapshot an elements initial position
     * Stored in ._first
     */
    first() {
        this._first = getSnapshot(this.elm);
        this.debug("first", this._first);

        return this;
    }

    /**
     * Snapshot an elements final position
     * Stored in ._last
     */
    last() {
        this._last = getSnapshot(this.elm);
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

        this.debug("invert",this.elm.style.transform);

        return this;
    }

    /**
     * Plays back the animation
     */
    play() {
        // if we're not moving at all, just end without playing
        if (Math.abs(this._first.left - this._last.left) <= 1
         && Math.abs(this._first.top - this._last.top) <= 1
         && Math.abs(this._first.width - this._last.width) <= 1
         && Math.abs(this._first.height - this._last.height) <= 1
         && Math.abs(this._first.opacity - this._last.opacity) <= 0.05) {
            this.debug("Ending early because of no change");
            this.cleanAndFinish();
            return this;
        }

        this.elm.offsetHeight; // force reflow
        this.elm.style.transition = getTransitionString(this.opts);
        this.elm.offsetHeight; // force reflow

        // add our animation classes
        this.elm.classList.add(this.opts.animatingClass);
        if ((this._first.width !== this._last.width)
            || (this._first.height !== this._last.height)) {
            this.elm.classList.add(this.opts.scalingClass);
        }

        // animate to end position
        this.elm.style.opacity = this._last.opacity;
        this.elm.style.transform = this._last.transform;

        // in case transitionend isn't called (element is removed, etc.)
        // use a timer fallback which is slightly delayed but avoids
        // missing callbacks
        let _timerFallback = setTimeout(()=>{
            this.cleanAndFinish();
        }, this.opts.duration*1000 + 100);
        // wait for transitionend
        this.elm.addEventListener("transitionend", ()=>{
            clearTimeout(_timerFallback);
            this.cleanAndFinish();
        });

        return this;
    }

    /**
     * Called when the animation is finished
     */
    cleanAndFinish() {
        this._first = null;
        this._last = null;
        this.elm.classList.remove(this.opts.animatingClass,
                                  this.opts.scalingClass);
        this.elm.style.opacity = 
            this.elm.style.transition =
            this.elm.style.transform =
            this.elm.style.transformOrigin =
            this.elm.style.willChange = "";
        
        if (this.opts.callback) {
            this.opts.callback();
        }
    }

    /**
     * Logs debug info
     */
    debug(method, meta) {
        if (this.opts.debug) {
            console.log("[",this.elm,"] ",method,meta);
        }
    }
}