import { expect } from "chai";
import FLIPElement from "../src/element";
import * as helpers from "./test-helpers";

const RECT_KEYS = [
    "x", "y",
    "left", "right", "top", "bottom",
    "width", "height"
];

describe("FLIPElement", function() {
    it("should only allow 1 instance per HTMLElement", function(){
        let elm = helpers.createTestElement();
        let $elm1 = new FLIPElement(elm);
        let $elm2 = new FLIPElement(elm);

        expect($elm1 === $elm2).to.be.true;
    });
    it("should respect duration option", function(done) {
        let t = performance.now();
        let elm = helpers.createTestElement();
        let $elm = new FLIPElement(elm, {
            callback: ()=>{
                // 16 ms ≈ 1 frame
                expect(performance.now()-t).to.be.within(
                    200-16*4,
                    200+16*4
                );
                done();
            },
            duration: 200
        });
        $elm.first();
        elm.style.left = elm.style.width = "100px";
        $elm.last()
            .invert()
            .play();
    });
    it("should respect ease option", function(done) {
        let elm = helpers.createTestElement();
        let $elm = new FLIPElement(elm, {
            ease: "ease-in-out"
        });
        $elm.first();
        elm.style.left = elm.style.width = "100px";
        $elm.last()
            .invert()
            .play();
        requestAnimationFrame(()=>{
            expect(elm.style.transitionTimingFunction).to.contain("ease-in-out");
            done();
        });
    });
    it("should call callback once", function(done) {
        let callTimes = 0;
        let elm = helpers.createTestElement();
        let $elm = new FLIPElement(elm, {
            callback: ()=>{
                ++callTimes;
            },
            duration: 50
        });
        $elm.first();
        elm.style.left = elm.style.width = "100px";
        $elm.last()
            .invert()
            .play();
        setTimeout(()=>{
            expect(callTimes).to.equal(1);
            done();
        }, 250);
    });

    describe(".first()", function(){
        it("should jump to end when starting a new flip", function(done) {
            let elm = helpers.createTestElement();
            let $elm = new FLIPElement(elm, {duration: 400, "ease": "linear"});
            $elm.first();
            elm.style.top = elm.style.width = "100px";
            let pre = elm.getBoundingClientRect();
            $elm.last()
                .invert()
                .play();
            
            setTimeout(()=>{
                $elm.first();
                elm.style.top = elm.style.width = "150px";
                $elm.last()
                    .invert()
                    .play();

                let post = elm.getBoundingClientRect();
                RECT_KEYS.forEach(
                    k => {
                        expect(pre[k]-post[k], `${k}: ${pre[k]}=>${post[k]}`)
                            .to.be.within(-1,1);
                    }
                );

                done();
            }, 200);
        });

        it("should call old callback when resetting", function(done){
            let _firstCalled = false;
            let elm = helpers.createTestElement();
            let $elm = new FLIPElement(elm, {
                callback: ()=>{
                    _firstCalled = true;
                }
            });
            $elm.first();
            elm.style.top = elm.style.width = "100px";
            $elm.last()
                .invert()
                .play();
            
            setTimeout(()=>{
                $elm = new FLIPElement(elm, {
                    callback: ()=>{
                        if (_firstCalled) {
                            done();
                        }
                    }
                });
                $elm.first();
                elm.style.top = elm.style.width = "150px";
                $elm.last()
                    .invert()
                    .play();
            }, 200);
        });
    });

    describe(".invert()", function() {
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
                    elm.style.transform = "translate(50px,50px)";
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
         * Runs tests on FLIPElement's ability to invert a DOM change
         * Tests from base to each state (and the inverse)
         * @param {Function} base       Gets elm as only param. Sets the base state.
         * @param {...Function} states  Gets elm as only param. Sets a state to test.
         */
        function runInvertTest(base,...states) {
            let data;

            for (let i=0; i < states.length; ++i) {
                let state = states[i];

                data = invertTest(base, state);

                const keys = [
                    "x", "y",
                    "left", "right", "top", "bottom",
                    "width", "height"
                ];
                
                // test from base to state
                RECT_KEYS.forEach(
                    k => {
                        let delta = data.post[k]-data.pre[k];
                        expect(delta).to.be.within(-1,1, `Invert state ${i}-${k}\n${helpers.rectToString(data.pre)}=>${helpers.rectToString(data.post)}`);
                    }
                );

                // test from state to base
                data = invertTest(state, base);
                RECT_KEYS.forEach(
                    k => {
                        let delta = data.post[k]-data.pre[k];
                        expect(delta).to.be.within(-1,1, `Invert state ${i}r-${k}\n${helpers.rectToString(data.pre)}=>${helpers.rectToString(data.post)}`);
                    }
                )
            }
        }
        function invertTest(pre,modify) {
            let elm = helpers.createTestElement();
            let $elm = new FLIPElement(elm, {
                duration: 400,
                ease: "ease",
                animatingClass: "flip-animating",
                scalingClass: "flip-scaling"
            });

            if (pre) {
                pre(elm);
            }
            let prePos = elm.getBoundingClientRect();
            $elm.first();
            modify(elm);
            $elm.last()
                .invert();
            let postPos = elm.getBoundingClientRect();

            return {
                pre: prePos,
                post: postPos,
                elm: elm
            };
        }
    });

    describe(".play()", function() {
        it("should animate", function(done) {
            function testElm(elm, $elm, cb, id) {
                const pre = elm.getBoundingClientRect();
                $elm.first();
                elm.style.left =
                    elm.style.top =
                    elm.style.height =
                    elm.style.width = "100px";
                const post = elm.getBoundingClientRect();
                $elm.last()
                    .invert()
                    .play();
                setTimeout(()=>{
                    const mid = elm.getBoundingClientRect();
                    for (let k in mid) {
                        expect(pre[k]-mid[k], `${id} - pre.${k}: ${pre[k]}=>${mid[k]}`)
                            .to.not.be.within(-1,1);
                        expect(post[k]-mid[k], `${id} - post.${k}: ${post[k]}=>${mid[k]}`)
                            .to.not.be.within(-1,1);
                    }
                    cb();
                }, 200);
            }
            const elm = helpers.createTestElement();
            const $elm = new FLIPElement(elm, {duration: 400});
            const elmNoScale = helpers.createTestElement();
            const $elmNoScale = new FLIPElement(elmNoScale, {
                duration: 400,
                useScale: false
            });
            
            let cbTimes = 0;
            const cb = () => {if (++cbTimes >= 2) { done(); }};
            testElm(elm, $elm, cb, "normal");
            testElm(elmNoScale, $elmNoScale, cb, "no scale");
        });
        it("should animate width if not using scale", function() {
            const elm = helpers.createTestElement();
            const $elm = new FLIPElement(elm, {
                duration: 400,
                useScale: false
            });
            $elm.first();
            elm.style.width = "100px";
            elm.style.height = "100px";
            $elm.last()
                .invert();
            expect(elm.style.width).to.equal("50px");
            expect(elm.style.height).to.equal("50px");
            $elm.play();
            const transition = elm.style.transition;
            expect(transition).to.include("width");
            expect(transition).to.include("height");
        });
        it("should end immediately if there is no change", function(done) {
            let t = performance.now();
            let elm = helpers.createTestElement();
            let $elm = new FLIPElement(elm, {
                callback: function() {
                    // 16 ms ≈ 1 frame
                    expect(performance.now()-t)
                        .to.be.lessThan(16, "time to call callback");
                    done();
                }
            });
            $elm.first()
                .last()
                .invert()
                .play();
        });
        it("should not end immediately if there is a change", function(done) {
            let t = performance.now();
            let elm = helpers.createTestElement();
            let $elm = new FLIPElement(elm, {
                callback: function() {
                    // 16 ms ≈ 1 frame
                    expect(performance.now()-t)
                        .to.be.greaterThan(400-16*4, "time to call callback");
                    done();
                },
                duration: 400
            });
            $elm.first();
            elm.style.left = elm.style.top = "100px";
            $elm.last()
                .invert()
                .play();
        });

        it("should apply animation class", function(done) {
            let elm = helpers.createTestElement();
            let $elm = new FLIPElement(elm, {
                animatingClass: "test-class"
            });
            $elm.first();
            elm.style.left = elm.style.top = "100px";
            $elm.last()
                .invert()
                .play();
            
            requestAnimationFrame(()=>{
                expect(elm.classList.contains("test-class")).to.be.true;
                done();
            });
        });
        it("should apply scaling class", function(done) {
            let elm = helpers.createTestElement();
            let $elm = new FLIPElement(elm, {
                scalingClass: "test-class"
            });
            $elm.first();
            elm.style.width = elm.style.height = "100px";
            $elm.last()
                .invert()
                .play();
            requestAnimationFrame(()=>{
                expect(elm.classList.contains("test-class")).to.be.true;
                done();
            });
        });
        it("should not apply scaling class if not scaling", function(done) {
            let elm = helpers.createTestElement();
            let $elm = new FLIPElement(elm, {
                scalingClass: "test-class"
            });
            $elm.first();
            elm.style.left = elm.style.top = "100px";
            $elm.last()
                .invert()
                .play();
            requestAnimationFrame(()=>{
                expect(elm.classList.contains("test-class")).to.be.false;
                done();
            });
        });

        it("should support fallback in case of no transitionend", function(done) {
            let t = performance.now();
            let elm = helpers.createTestElement();
            elm.addEventListener("transitionend", (e)=>{
                e.stopImmediatePropagation();
            });
            let $elm = new FLIPElement(elm, {
                callback: ()=>{
                    expect(performance.now()-t).to.be.within(
                        400-16,
                        500+16
                    );
                    done();
                },
                duration: 400
            });
            $elm.first();
            elm.style.left = elm.style.top = "100px";
            $elm.last()
                .invert()
                .play();
            
        });

        it("should respect existing transition", function(){
            let elm = helpers.createTestElement();
            let $elm = new FLIPElement(elm);
            elm.classList.add("transition-opacity");
            let style = document.createElement("style");
            style.textContent = `
            .transition-opacity {
                transition: opacity .5s linear;
            }`;
            document.head.appendChild(style);
            $elm.first();
            elm.style.left = elm.style.top = "100px";
            $elm.last()
                .invert()
                .play();
            
            expect(elm.style.transition).to.match(/opacity 0?.5s linear/);
        });
    });
});
