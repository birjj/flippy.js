# FlippyJS [![](https://travis-ci.org/birjolaxew/flippy.js.svg?branch=develop)](https://travis-ci.org/birjolaxew/flippy.js)
FlippyJS is a helper library for [FLIP animations](https://aerotwist.com/blog/flip-your-animations/) - it allows you to easily animate any changes you make to the DOM, without having to specify the animation manually. All animations are done using CSS animations.

It is exported as a UMD library, supporting both AMD, CommonJS and basic `<script>` usage.

## Usage
Flippy.js exposes the function `flip(elements, modifier, [options])`. Pass it the elements you want to animate, a function which should modify the DOM when called, and an optional options object. It returns a `Promise` which resolves when the animation is finished.

For specifics, see [our docs](https://github.com/birjolaxew/flippy.js/wiki/Usage).

Here's a quick example:
```javascript
let container = document.querySelector(".notification-container");
flip(
  ".notification", // the elements to animate
  ()=>{ // called when we should make the DOM change
    container.insertBefore(
      generateNotification(),
      container.firstChild
    );
  }
).then(()=>{
  console.log("Animation finished");
});

function generateNotification() { /* ... */ }
```

## Advanced usage

Internally, FlippyJS uses a `FLIPElement` class to represent elements that are being animated. This class is exposed as `flip.FLIPElement`, should you wish to play around with it.

More details at [our docs](https://github.com/birjolaxew/flippy.js/wiki/Advanced-Usage).
