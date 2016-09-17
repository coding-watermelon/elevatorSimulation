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
      var options = renderer.getDrawOptions(canvas, state);
      renderer.drawBase(canvas, ctx, state, options);
      renderer.drawElevators(canvas, ctx, state, options);
      renderer.drawLevels(canvas, ctx, state, options);
      renderer.drawPeople(canvas, ctx, state, options);
    } catch(ex) {
      console.log(ex);
    }

    renderer.lastRenderingTimestamp = Date.now();
    renderer.lastRenderedState = state;
  }

  renderer.getDrawOptions = function(canvas, state) {
    var options = {};

    options.levelsHeight = Math.round(canvas.height * 0.9);
    options.levelHeight = Math.round(options.levelsHeight / state.levels.length);
    
    options.elevatorMargin = 10;
    options.elevatorPadding = 5;
    options.elevatorWidth = 75;
    options.elevatorHeight = options.levelHeight + (options.elevatorMargin * 2);

    options.elevatorsWidth = Math.round(options.elevatorWidth * state.elevators.length) + ((options.elevatorMargin * 2) * state.elevators.length)
    options.elevatorsHeight = options.levelsHeight;

    options.elevatorsStartX = Math.round((canvas.width / 2) - (options.elevatorsWidth / 2));
    options.elevatorsStartY = Math.round((canvas.height / 2) - (options.elevatorsHeight / 2));
    options.elevatorsEndX = options.elevatorsStartX + options.elevatorsWidth;
    options.elevatorsEndY = options.elevatorsStartY + options.elevatorsHeight;

    return options;
  }

  renderer.drawBase = function(canvas, ctx, state, options) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = renderer.primaryColor;
    ctx.strokeStyle = renderer.primaryColor;
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
  }

  renderer.drawElevators = function(canvas, ctx, state, options) {
    // frame
    ctx.restore();
    ctx.strokeStyle = renderer.elevatorColor;
    ctx.fillStyle = renderer.elevatorColor;
    ctx.strokeRect(options.elevatorsStartX, options.elevatorsStartY, options.elevatorsWidth, options.elevatorsHeight);

    for (var index = 0; index < state.elevators.length; index++) {
      var elevator = state.elevators[index];

      var elevatorStartX = options.elevatorsStartX + options.elevatorMargin + (index * (options.elevatorWidth + 2 * options.elevatorMargin));
      var elevatorStartY = options.elevatorsStartY + options.elevatorMargin;
      var elevatorEndX = elevatorStartX + options.elevatorWidth;
      var elevatorEndY = elevatorStartY + options.elevatorHeight;

      // frame
      ctx.strokeRect(elevatorStartX, elevatorStartY, options.elevatorWidth, options.elevatorHeight);
    }
  }

  renderer.drawLevels = function(canvas, ctx, state, options) {
  }

  renderer.drawPeople = function(canvas, ctx, state, options) {
    
  }

  renderer.getRenderingInterval = function() {
    return Math.floor(1000 / renderer.frameRate);
  }

  return renderer;
}();