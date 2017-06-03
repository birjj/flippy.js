/* global expect, flip */
describe("Flippy.JS", function() {
  it("is defined globally (UMD)", function(){
    expect(flip).to.exist;
  });

  let elm;
  it("should translate elements back", function(){
    elm = document.createElement("div");
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

  it("should succeed", ()=>{
    expect(2).to.equal(2);
  });
});
