function createFlipElm(elm) {
    return new flip.FLIPElement(
        elm,
        {
            duration: 1000,
            useScale: false
        }
    );
}
let $elm = document.querySelector(".animating-width-and-height-instead-of-scale .module");
let _elm;
$elm.addEventListener("click",
    () => {
        _elm = _elm || createFlipElm($elm);
        _elm.first();
        $elm.classList.toggle("open");
        _elm.last().invert().play();
    }
);