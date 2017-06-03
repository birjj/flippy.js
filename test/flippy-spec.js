/* global expect, flip */
describe("Flippy.JS", function() {
    // exists
    it("is defined globally (UMD)", function(){
        expect(flip).to.exist;
    });
  
    let placeholderElm = document.createElement("div");

    // throws on wrong input
    it("should throw if not given element", function(){
        expect(()=>{ // no element
            flip(null, ()=>{});
        }).to.throw();
        expect(()=>{ // invalid element
            flip({}, ()=>{});
        }).to.throw();
    });
    it("should throw if not given modifier", function(){
        expect(()=>{ // no modifier
            flip(placeholderElm);
        }).to.throw();
        expect(()=>{ // invalid modifier
            flip(placeholderElm, {});
        }).to.throw();
    });
    
    // accepts input
    it("should call the modifier", function(){
        let called = false;
        flip(placeholderElm, ()=>{
            called = true;
        });
        expect(called).to.be.true;
    });

    // inverts
    it("should invert moved elements", function(){
        runInvertTest(
            (elm)=>{
                elm.style.left = "0px";
                elm.style.top = "0px";
            },
            (elm)=>{
                elm.style.left = "50px";
                elm.style.top = "50px";
            },
            (elm)=>{
                elm.style.left = "100px";
                elm.style.top = "150px";
            }
        );
    });
    it("should invert resized elements", function(){
        runInvertTest(
            (elm)=>{
                elm.style.width = "100px";
                elm.style.height = "100px";
            },
            (elm)=>{
                elm.style.width = "50px";
                elm.style.height = "50px";
            },
            (elm)=>{
                elm.style.width = "150px";
                elm.style.height = "100px";
            }
        );
    });

    it("should invert bordered elements", function(){
        runInvertTest(
            (elm)=>{
                elm.style.border = "none";
            },
            (elm)=>{
                elm.style.border = "10px solid red";
            },
            (elm)=>{
                elm.style.border = "50px solid green";
            }
        );
    });

    it("should invert translated elements", function(){
        runInvertTest(
            (elm)=>{
                elm.style.transform = "none";
            },
            (elm)=>{
                elm.style.transform = "translate(10px,10px)";
            },
            (elm)=>{
                elm.style.transform = "translate(50%, 25%)";
            }
        );
    });

    it("should invert rotated elements", function(){
        runInvertTest(
            (elm)=>{
                elm.style.transform = "none";
            },
            (elm)=>{
                elm.style.transform = "rotate(45deg)";
            }
        );
    });

    it("should invert scaled elements", function(){
        runInvertTest(
            (elm)=>{
                elm.style.transform = "none";
            },
            (elm)=>{
                elm.style.transform = "scale(2)";
            },
            (elm)=>{
                elm.style.transform = "scale(1,3)";
            }
        );
    });

    it("should invert multi-transformed elements", function(){
        runInvertTest(
            (elm)=>{
                elm.style.transform = "none";
            },
            (elm)=>{
                elm.style.transform = "translate(10px,20px) rotate(45deg) scale(2)";
            },
            (elm)=>{
                elm.style.transform = "rotate(45deg) translate(10%,20%) scale(1,2)";
            }
        );
    });



    /**
     * Runs tests on flippy's ability to invert a DOM change
     * Tests from base to each state (and the inverse)
     * @param {Function} base       Gets elm as only param. Sets the base state.
     * @param {...Function} states  Gets elm as only param. Sets a state to test.
     */
    function runInvertTest(base,...states) {
        let data;

        for (let i=0; i < states.length; ++i) {
            let state = states[i];

            data = invertTest(base, state);
            for (let k in data.pre) {
                let delta = data.post[k]-data.pre[k];
                expect(delta).to.be.within(-1,1, `Invert state ${i}-${k}`);
            }

            data = invertTest(state, base);
            for (let k in data.pre) {
                let delta = data.post[k]-data.pre[k];
                expect(delta).to.be.within(-1,1, `Invert state ${i}r-${k}`);
            }
        }
    }
    function invertTest(pre,modify) {
        let elm = document.createElement("div");
        elm.style.position = "absolute";
        elm.style.top = "50px";
        elm.style.left = "50px";
        elm.style.width = "50px";
        elm.style.height = "50px";
        document.body.appendChild(elm);

        if (pre) {
            pre(elm);
        }
        let prePos = elm.getBoundingClientRect();
        flip(elm, modify.bind(null, elm));
        let postPos = elm.getBoundingClientRect();

        return {
            pre: prePos,
            post: postPos,
            elm: elm
        };
    }
});