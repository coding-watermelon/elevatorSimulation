var renderer = function(){

  var renderer = {
  };

  renderer.frameRate = 30;
  renderer.renderingInterval;
  renderer.renderingTimeout;

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
    console.log("Starting state rendering");
    renderer.renderingInterval = renderer.getRenderingInterval();

    renderer.renderingTimeout = window.setTimeout(renderLatestState, renderer.renderingInterval);
  }

  renderer.stopRenderingStates = function() {
    console.log("Stopping state rendering");
    window.clearTimeout(renderer.renderingTimeout);
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

  renderer.renderLatestState = function() {
    if (renderer.shouldRenderState(renderer.latestState)) {
      renderer.renderStateOnCanvas(renderer.latestState, renderer.canvas);
    }
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