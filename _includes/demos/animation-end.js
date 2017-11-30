const $module = document.querySelector(".listening-for-animation-end .module");
const baseState = {
    left: "", top: "",
    right: "", bottom: "",
    transform: ""
};
const states = [
    {
        left: "50px", top: "50px",
        transform: "rotate(45deg)"
    },
    {
        left: "50px", bottom: "50px"
    },
    {
        right: "50px", bottom: "50px",
        transform: "scale(0.5)"
    },
    {
        top: "50px", right: "50px"
    }
];
let index = -1;

function animate() {
    if (index === states.length-1) {
        index = -1;
    }

    flip(
        $module,
        ()=>{
            const state = states[++index];
            for (let prop in baseState) {
                if (state.hasOwnProperty(prop)) {
                    $module.style[prop] = state[prop];
                } else {
                    $module.style[prop] = baseState[prop];
                }
            }
        }
    ).then(animate);
}
document.addEventListener("DOMContentLoaded", animate);
