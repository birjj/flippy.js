# Flippy.JS
Flippy is a helper library for [FLIP animations](https://aerotwist.com/blog/flip-your-animations/) - it allows you to easily animate any changes you make to the DOM, without having to specify the animation manually. All animations are done using CSS animations.

It supports both AMD, CommonJS, jQuery and browser usage.

## Usage
Using Flippy is simple. All you need is an array of elements you want to animate, and a callback which is called when you should do the DOM change.

### Default usage
If the library is loaded without jQuery, the function `flip` is created. If neither an AMD nor a CommonJS bundler is used, it is registered on the root object. The first parameter is the elements to animate, the second is the mentioned callback. An optional third parameter is [the configuration object](#configuration).

Here's an example from our demo - this adds a new element to a list, animating all other elements in the list smoothly to their new position:
```javascript
var container = document.querySelector(".notification-container"),
    elms = document.querySelectorAll(".notifications");

flip(elms,
  function doChange(){ // called when we should make the DOM change
    container.insertBefore(
      (new Notification()).elm,
      container.firstChild
    );
  },
  
  function onDone(){ // called when the animations finish
    console.log("Animations have finished");
  }
);
```

### jQuery usage
If the library is loaded with jQuery present, it is instead bound as a jQuery plugin. In this case, all jQuery collections have the method `.flip`, which takes up to two parameters. The first parameter is the callback which should alter the DOM, the optional second parameter is [the configuration object](#configuration).

Here's the above example, rewritten in jQuery:
```javascript
var $container = $(".notification-container");
$(".notifications").flip(
  function doChange(){ // called when we should make the DOM change
    $container.prepend( (new Notification()).elm );
  },
  
  function onDone() { // called when the animations finish
    console.log("Animations have finished");
  }
);
```

## Configuration
The last parameter when calling the helper is a configuration object. This accepts a number of settings, which are explained in [flippy.js](flippy.js#L27). The default values are:

```javascript
{
	duration: .4, // duration of animation in seconds
	ease: "ease", // name of CSS easing function to use
	animatingClass: "flip-animating", // class to apply to elements that are animating
	scalingClass: "flip-scaling" // class to apply to elements that scale
	//callback: <function> // function to call when the animation has ended
}
```
