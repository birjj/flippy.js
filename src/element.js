"use strict";
import { getSnapshot, getDelta, getTransitionFromElm } from "./helpers";

/** @type {Map<HTMLElement, FLIPElement>} */
let elmMap = new Map();

/**
 * Handler for a single element in a FLIP animation
 */
export default class FLIPElement {
    constructor(elm, options) {
        if (!(elm instanceof HTMLElement)) {
            throw new TypeError("Element must be an HTMLElement");
        }
        if (elmMap.has(elm)) {
            let self = elmMap.get(elm);
            this.opts = {}; // remove old options
            self.setOptions(options);
            return self;
        }

        this.setOptions(options);
        elmMap.set(elm, this);

        this.elm = elm;
        this._style = {};
    }

    /**
     * Applies options
     * @param {Object} options The options object
     * @param {Number} [options.duration=400] Length of animation in milliseconds
     * @param {String} [options.ease="ease"] CSS timing function to use for easing
     * @param {String} [options.animatingClass="flip-animating"] Class to apply when animating
     * @param {String} [options.scalingClass="flip-scaling"] Class to apply when scaling
     */
    setOptions(options) {
        this.opts = Object.assign({}, {
            duration: 400,
            ease: "ease",
            animatingClass: "flip-animating",
            scalingClass: "flip-scaling"
        }, this.opts, options);
    }

    /**
     * Snapshot an elements initial position
     * Stored in ._first
     */
    first() {
        if (this._playing) {
            this.stop();
        }
        this._first = getSnapshot(this.elm);
        this.debug("first", this._first);

        return this;
    }

    /**
     * Snapshot an elements final position
     * Stored in ._last
     */
    last() {
        if (!this._first) {
            throw new Error(".first() must be called before .last()");
        }
        this._last = getSnapshot(this.elm);
        this.debug("last", this._last);

        // save old styles for when we remove flip
        this._style.willChange = this.elm.style.willChange;
        this._style.transform = this.elm.style.transform;
        this._style.transformOrigin = this.elm.style.transformOrigin;
        this._style.transition = getTransitionFromElm(this.elm);

        for (let k in this._style) {
            let style = this._style[k];
            this._style[k] = (style && style!=="none") ? style : "";
        }

        return this;
    }

    /**
     * Applies a transform from ._last => ._first
     * This moves the element back to where it was
     */
    invert() {
        if (!this._first || !this._last) {
            throw new Error(".first() and .last() must be called before .invert()");
        }

        let delta = getDelta(this._first, this._last);

        this.elm.style.transformOrigin = "50% 50%";
        // if the original transform contains rotates, we need to move first
        // (so it moves along the non-rotated axis) and scale last (so it scales
        // along the rotated axis)
        this.elm.style.transform =
            `translate(${delta.left.toFixed(2)}px, ${delta.top.toFixed(2)}px)
             ${this._first.transform}
             scale(${delta.width.toFixed(2)}, ${delta.height.toFixed(2)})`;
        this.elm.style.willChange = "transform";

        this.debug("invert",this.elm.style.transform);

        return this;
    }

    /**
     * Plays back the animation
     */
    play() {
        if (this._playing) {
            this.stop();
        }
        this._playing = true;

        // if we're not moving at all, just end without playing
        if (Math.abs(this._first.left - this._last.left) <= 1
         && Math.abs(this._first.top - this._last.top) <= 1
         && Math.abs(this._first.width - this._last.width) <= 1
         && Math.abs(this._first.height - this._last.height) <= 1) {
            this.debug("Ending early because of no change");
            this._animCb = this.opts.callback;
            this.stop();
            return this;
        }

        this.elm.offsetHeight; // force reflow
        this.elm.style.transition = [
            this._style.transition,
            `transform ${(this.opts.duration/1000).toFixed(2)}s ${this.opts.ease}`
        ].filter(Boolean).join(", ");
        this.elm.offsetHeight; // force reflow

        // add our animation classes
        this.elm.classList.add(this.opts.animatingClass);
        if ((this._first.width !== this._last.width)
            || (this._first.height !== this._last.height)) {
            this.elm.classList.add(this.opts.scalingClass);
        }

        // animate to end position
        this.elm.style.transform = this._last.transform;

        // if cb changes before animation finishes, cache it here
        // this could e.g. happen if we start a new animation
        this._animCb = this.opts.callback;

        this._onTransitionEnd = ((e)=>{
            if (e.propertyName === "transform") {
                this.stop();
            }
        }).bind(this);

        // in case transitionend isn't called (element is removed, etc.)
        // use a timer fallback which is slightly delayed but avoids
        // missing callbacks
        this._timerFallback = setTimeout(
            ()=>this._onTransitionEnd({propertyName: "transform"}),
            this.opts.duration + 100
        );
        // wait for transitionend
        this.elm.addEventListener("transitionend", this._onTransitionEnd);

        return this;
    }

    /**
     * Stops an in-progress animation
     */
    stop() {
        clearTimeout(this._timerFallback);
        this.elm.removeEventListener("transitionend", this._onTransitionEnd);
        this.clean()
            .finish();
        return this;
    }

    /**
     * Removes all FLIP-related data from element
     */
    clean() {
        this._first = null;
        this._last = null;

        this.elm.classList.remove(this.opts.animatingClass,
                                  this.opts.scalingClass);
        this.elm.style.transition = this._style.transition;
        this.elm.style.transformOrigin = this._style.transformOrigin;
        this.elm.style.willChange = this._style.willChange;

        // Firefox keeps playing playing a transition after it's removed
        // To stop this, we change transform, reflow and then set it to what we want
        this.elm.style.transform = this._style.transform ?
                                    "" : "translateX(10px)";
        this.elm.offsetHeight;
        this.elm.style.transform  = this._style.transform;

        return this;
    }

    /**
     * Called when the animation is finished
     * @param {Function} [callback]
     */
    finish() {
        this._playing = false;        
        if (this._animCb) {
            this._animCb();
            this._animCb = null;
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