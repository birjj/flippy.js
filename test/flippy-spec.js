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
    it("should call the modifier (synchronously)", function(){
        let called = false;
        flip(placeholderElm, ()=>{
            called = true;
        });
        expect(called).to.be.true;
    });

    // does what it should
    it("should translate elements back", function(){
        let elm = document.createElement("div");
        elm.textContent = "should translate elements back";
        document.body.appendChild(elm);

        let origPos = elm.getBoundingClientRect();
        flip(elm, ()=>{
            elm.style.position = "fixed";
            elm.style.bottom = "5px";
            elm.style.right = "5px";
        });
        let newPos = elm.getBoundingClientRect();

        expect(origPos.left).to.equal(newPos.left);
        expect(origPos.top).to.equal(newPos.top);
    });
});
