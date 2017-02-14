describe("Flippy.JS", function() {
  it("is defined globally", function(){
    expect(window.flip).toBeDefined();
  });

  it("should fail", function(){
    expect(2).toEqual(4);
  });

  it("should succeed", ()=>{
    expect(2).toEqual(2);
  });
});
