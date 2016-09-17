var renderer = function(){

  var renderer = {
  };

  renderer.frameRate = 30;
  renderer.renderingInterval;

  renderer.lastRenderingTimestamp = 0;
  renderer.lastRenderedState;
  renderer.latestState;

  renderer.initializeCanvas = function(canvas) {
    console.log("Initializing canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer.canvas = canvas;
  }

  renderer.startRenderingStates = function() {
    renderer.renderingInterval = renderer.getRenderingInterval();


  }

  renderer.stopRenderingStates = function() {
    
  }

  renderer.setLatestState = function(state) {
    renderer.latestState = state;
  }

  renderer.shouldRenderState = function(state) {
    // check if we have an updated state
    if (renderer.lastRenderedState == renderer.latestState) {
      return false;
    }
    
    // check if we are in the rendering interval
    var now = Date.now();
    if (now < renderer.lastRenderingTimestamp + renderer.renderingInterval) {
      return false;
    }

    return true;
  }

  renderer.renderState = function(state) {
  	renderer.renderStateOnCanvas(state, renderer.canvas);
  }

  renderer.renderStateOnCanvas = function(state, canvas) {
    renderer.lastRenderingTimestamp = Date.now();
    renderer.lastRenderedState = state;
  }

  renderer.getRenderingInterval = function() {
    return Math.floor(1000 / renderer.frameRate);
  }

  return renderer;
}();