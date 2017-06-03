/* global expect, flip */
describe("Flippy.JS", function() {
  it("is defined globally (UMD)", function(){
    expect(flip).to.exist;
  });
  
  let placeholderElm = document.createElement("div");

  it("should throw if not given element", function(){
    expect(()=>{
      flip(null, ()=>{});
    }).to.throw();
  });
  it("should throw if not given modifier", function(){
    expect(()=>{
      flip(placeholderElm);
    }).to.throw();
  });
  
  it("should call the modifier (synchronously)", function(){
    let called = false;
    flip(placeholderElm, ()=>{
      called = true;
    });
    expect(called).to.be.true;
  });

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
