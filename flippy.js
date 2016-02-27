/**
 * FLIP animation helper
 * See https://aerotwist.com/blog/flip-your-animations/
 *
 * Animation principle by Paul Lewis
 * Code by Birjolaxew
 *
 * TODO: parse existing transform/transition values, so we don't overwrite unnecesarrily
 */

(function(root, factory){
	if (typeof define === "function" && define.amd) { // AMD support
		define(factory);
	} else if (typeof jQuery === "function") { // jQuery support
		var flip = factory();
		jQuery.fn.flip = function(){
			// call flip with elements set to this collection
			flip.apply(null, this.toArray().concat(arguments));
			return this;
		};
	} else if (typeof module === "object" && module.exports) { // CommonJS support
		module.exports = factory();
	} else {
		root.flip = factory();
	}
})(this, function(){
	var DEFAULTS = {
		duration: .4, // duration of animation in seconds
		ease: "ease", // name of CSS easing function to use
		animatingClass: "flip-animating", // class to apply to elements that are animating
		scalingClass: "flip-scaling" // class to apply to elements that scale
		//callback: <function> // function to call when the animation has ended
	};

	/**
	 * Animate a group of elements using the FLIP principle
	 * @param  {Array|NodeList} elements List of elements animate
	 * @param  {Function} doChange Callback which triggers the change in DOM
	 * @param  {Object} options  Options object. See defaults (above) for details
	 */
	var flip = function flip(elements, doChange, options) {
		options = options || {};
		for (var k in DEFAULTS) { // fill missing options with defaults
			if (!options.hasOwnProperty(k)) {
				options[k] = DEFAULTS[k];
			}
		}
		// fail early if we shouldn't animate, or if we have no elements
		if (!+options.duration || !elements || elements.length === 0) {
			return console.warn("[FLIP] Tried to FLIP empty element set, or with 0 duration");
		}
		// support single element
		elements = elements.length ? elements : [elements];

		// == Start FLIP == //
		// get all positions/sizes of elements
		var old = snapshot(elements);

		// ask caller to do DOM change
		doChange();

		// transform back to old positions
		for (var i = 0, j = elements.length; i < j; ++i) {
			var elm = elements[i],
			    _old = old[i],
			    _new = elm.getBoundingClientRect();

			// calculating offset from middle of object
	    // this works with flexbox (calculating from corner does not)
	    var delta = {
	      left: (_old.left+_old.width/2) - (_new.left+_new.width/2),
	      top: (_old.top+_old.height/2) - (_new.top+_new.height/2),
	      scaleWidth: _old.width / _new.width,
	      scaleHeight: _old.height / _new.height
	    };

	    // create transform
	    var moving = delta.left.toFixed(2) !== "0.00" || // if either left or top delta isn't 0
	    								delta.top.toFixed(2) !== "0.00";
	    var scaling = delta.scaleWidth.toFixed(2) !== "1.00" || // if either width or height scale isn't 1
	    								delta.scaleHeight.toFixed(2) !== "1.00";

	    elm.style.transform = 
	    	((moving ? "translate(" + // if we're moving, add translate transform
	    		delta.left.toFixed(2)+"px," +
	    		delta.top.toFixed(2)+"px" +
	    	")" : "") +
				(scaling ? " scale(" + // if we're scaling, add scale transform
					delta.scaleWidth.toFixed(2)+"," +
					delta.scaleHeight.toFixed(2) +
				")" : "")).trim();

	    // add appropriate classes
			if (moving || scaling) {
				elm.classList.add(options.animatingClass);
			}
			if (scaling) {
				elm.classList.add(options.scalingClass);
			}
		}

		// force a reflow
		+elements[0].offsetHeight;

		// then add CSS animations
		for (i = 0; i < j; ++i) {
			elements[i].style.transition = "transform "+options.duration+"s "+options.ease;
			elements[i].style.transform = "";

			// bind listener for transitionend
			elements[i].addEventListener("transitionend", function self(e){
				if (e.propertyName !== "transform") return;

				// remove our stuff
				this.style.transition = "";
				this.classList.remove(options.animatingClass, options.scalingClass);
				this.removeEventListener("transitionend", self); // including this listener

				// call callback once everything is done
				_onEnd();
			})
		}

		// called once a transition has ended; once every element calls it, it calls callback
		var _times = 0;
		var _onEnd = function(){
			if (++_times >= elements.length && options.callback) {
				options.callback();
			}
		}
	}

	/** Helper functions **/
	function snapshot(elements) {
		var outp = [];
		for (var i = 0, j = elements.length; i < j; ++i) {
			outp[i] = elements[i].getBoundingClientRect();
			// TODO: other properties (eg. opacity) ?
		}
		return outp;
	}

	// return the flip function
	return flip;
});