import { expect } from "chai";
import flip from "../src/flippy";
import * as helpers from "./test-helpers";

describe("Flippy.JS", function() {  
    // throws on wrong input
    it("should throw if not given element", function(){
        expect(()=>{ // no element
            flip(null, ()=>{});
        }, "no element").to.throw();
        expect(()=>{ // invalid element
            flip({}, ()=>{});
        }, "invalid element").to.throw();
        expect(()=>{
            flip([{}], ()=>{});
        }, "invalid array").to.throw();
    });
    it("should throw if not given modifier", function(){
        expect(()=>{ // no modifier
            flip(helpers.createTestElement());
        }, "no modifier").to.throw();
        expect(()=>{ // invalid modifier
            flip(helpers.createTestElement(), {});
        }, "invalid modifier").to.throw();
    });
    
    // accepts input
    it("should call the modifier once", function(){
        let callNum = 0;
        flip(helpers.createTestElement(), ()=>{
            ++callNum;
        });
        expect(callNum).to.equal(1);
    });
});