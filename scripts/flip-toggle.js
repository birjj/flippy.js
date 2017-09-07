let $toggle = document.getElementById("flip-toggle");
if ($toggle) {
    let toggleFLIP = (function(){
        let _flip = flip;
        let _noflip = function(elms, modifier) {
            return new Promise((res,rej)=>{
                modifier();
                setTimeout(res, 400);
            });
        }
        return function toggleFLIP(value) {
            if (value) {
                flip = _flip;
            } else {
                flip = _noflip;
            }
        }
    })();
    toggleFLIP($toggle.checked);
    $toggle.addEventListener("change", ()=>{
        toggleFLIP($toggle.checked);
    });
}