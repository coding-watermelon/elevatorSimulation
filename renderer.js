var renderer = function(){

  var renderer = {
  };

  renderer.frameRate = 10;
  renderer.renderingInterval;
  renderer.renderingIntervalObject;

  renderer.lastRenderingTimestamp = 0;
  renderer.lastRenderedState;
  renderer.latestState;

  renderer.primaryColor = "#388E3C";
  renderer.primaryColorLight = "#4CAF50";
  renderer.primaryColorDark = "#1B5E20";
  renderer.secondaryColor = "#FBC02D";
  
  renderer.elevatorColor = "#FFFFFF";
  renderer.levelColor = "#FFFFFF";


  renderer.initializeCanvas = function(canvas) {
    console.log("Initializing canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer.canvas = canvas;
  }

  renderer.startRenderingStates = function() {
    console.log("Starting state rendering");
    renderer.renderingInterval = renderer.getRenderingInterval();
    renderer.renderingIntervalObject = window.setInterval(renderer.renderLatestState, renderer.renderingInterval);
  }

  renderer.stopRenderingStates = function() {
    console.log("Stopping state rendering");
    window.clearInterval(renderer.renderingIntervalObject);
  }

  renderer.setLatestState = function(state) {
    renderer.latestState = state;
  }

  renderer.shouldRenderState = function(state) {
    // check if we have an updated state
    if (renderer.lastRenderedState == state) {
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
    } else {
      console.log("Skipping state rendering");
    }
  }

  renderer.renderStateOnCanvas = function(state, canvas) {
    console.log("Rendering state");

    try {
      var ctx = canvas.getContext("2d");
      renderer.drawBase(canvas, ctx, state);
      renderer.drawElevators(canvas, ctx, state);
      renderer.drawLevels(canvas, ctx, state);
      renderer.drawPeople(canvas, ctx, state);
    } catch(ex) {
      console.log(ex);
    }

    renderer.lastRenderingTimestamp = Date.now();
    renderer.lastRenderedState = state;
  }

  renderer.drawBase = function(canvas, ctx, state) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'rgba(0,153,255,0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  renderer.drawElevators = function(canvas, ctx, state) {
    
  }

  renderer.drawLevels = function(canvas, ctx, state) {
    
  }

  renderer.drawPeople = function(canvas, ctx, state) {
    
  }

  renderer.getRenderingInterval = function() {
    return Math.floor(1000 / renderer.frameRate);
  }

  return renderer;
}();