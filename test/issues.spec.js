import { expect } from "chai";
import FLIPElement from "../src/element";
import * as helpers from "./test-helpers";

describe("Bugs", function(){
    it("#3 - should not end animation early due to transition", function(done){
        let t = performance.now();
        let elm = helpers.createTestElement();
        elm.style.transition = "opacity 0.1s";
        let $elm = new FLIPElement(elm, {
            callback: ()=>{
                // 16 ms ≈ 1 frame
                expect(performance.now()-t).to.be.within(
                    400-16*4,
                    400+16*4
                );
                done();
            },
            duration: 400
        });
        $elm.first();
        elm.style.left = elm.style.width = "100px";
        elm.style.opacity = "0.25";
        $elm.last()
            .invert()
            .play();
    });
});