/**
 * Turns a ClientRect into a readable string
 * @param {Object} rect  The rect, returned by Element.getBoundingClientRect()
 * @returns {String}
 */
export function rectToString(rect) {
    return `{left: ${rect.left}, top: ${rect.top}, width: ${rect.width}, height: ${rect.height}}`;
}

/**
 * Generates an element for testing purposes
 * Element is absolutely positioned at {x:50,y:50,w:50,h:50}
 * @returns {HTMLElement}
 */
export function createTestElement() {
    let elm = document.createElement("div");
    elm.style.position = "absolute";
    elm.style.left =
        elm.style.top =
        elm.style.width =
        elm.style.height = "50px";
    document.body.appendChild(elm);
    return elm;
}