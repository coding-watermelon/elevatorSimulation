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

    window.onresize = function(event) {
      renderer.canvas.width  = window.innerWidth;
      renderer.canvas.height = window.innerHeight;
      renderer.renderLatestState(true);
    };

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

  renderer.renderLatestState = function(force) {
    if (force || renderer.shouldRenderState(renderer.latestState)) {
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
    ctx.fillStyle = renderer.primaryColor;
    ctx.strokeStyle = renderer.primaryColor;
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
  }

  renderer.drawElevators = function(canvas, ctx, state) {
    var elevatorMargin = 10;
    var elevatorPadding = 5;
    var elevatorWidth = 75;
    var elevatorHeight = 100;

    var elevatorsWidth = Math.round(elevatorWidth * state.elevators.length) + (elevatorMargin * 2 * state.elevators.length)
    var elevatorsHeight = Math.round(canvas.height * 0.9);

    var elevatorsStartX = Math.round((canvas.width / 2) - (elevatorsWidth / 2));
    var elevatorsStartY = Math.round((canvas.height / 2) - (elevatorsHeight / 2));
    var elevatorsEndX = elevatorsStartX + elevatorsWidth;
    var elevatorsEndY = elevatorsStartY + elevatorsHeight;

    // frame
    ctx.restore();
    ctx.strokeStyle = renderer.elevatorColor;
    ctx.fillStyle = renderer.elevatorColor;
    ctx.strokeRect(elevatorsStartX, elevatorsStartY, elevatorsWidth, elevatorsHeight);

    for (var index = 0; index < state.elevators.length; index++) {
      var elevator = state.elevators[index];

      var elevatorStartX = elevatorsStartX + elevatorMargin + (index * (elevatorWidth + 2 * elevatorMargin));
      var elevatorStartY = elevatorsStartY;
      var elevatorEndX = elevatorStartX + elevatorWidth;
      var elevatorEndY = elevatorStartY + elevatorHeight;

      // frame
      ctx.strokeRect(elevatorStartX, elevatorStartY, elevatorWidth, elevatorHeight);
    }
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