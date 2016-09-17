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
    options.levelsWidth = Math.round(canvas.width * 0.5);
    options.levelHeight = Math.round(options.levelsHeight / state.levels.length);

    options.elevatorMargin = 10;
    options.elevatorPadding = 5;
    options.elevatorWidth = 60;
    options.elevatorHeight = options.levelHeight - (options.elevatorMargin * 2);

    options.elevatorsWidth = Math.round(options.elevatorWidth * state.elevators.length) + ((options.elevatorMargin * 2) * state.elevators.length)
    options.elevatorsHeight = options.levelsHeight;

    options.elevatorsStartX = Math.round((canvas.width / 2) - (options.elevatorsWidth / 2));
    options.elevatorsStartY = Math.round((canvas.height / 2) - (options.elevatorsHeight / 2));
    options.elevatorsEndX = options.elevatorsStartX + options.elevatorsWidth;
    options.elevatorsEndY = options.elevatorsStartY + options.elevatorsHeight;

    options.levelsWidth = Math.max(options.levelsWidth, options.elevatorsWidth + 200);
    options.levelsStartX = Math.round((canvas.width / 2) - (options.levelsWidth / 2));
    options.levelsStartY = options.elevatorsStartY;

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
    ctx.restore();
    ctx.strokeStyle = renderer.elevatorColor;
    ctx.fillStyle = renderer.elevatorColor;
    ctx.lineWidth = 1.5;

    // frame
    //ctx.strokeRect(options.elevatorsStartX, options.elevatorsStartY, options.elevatorsWidth, options.elevatorsHeight);

    for (var index = 0; index < state.elevators.length; index++) {
      var elevator = state.elevators[index];

      var elevatorStartX = options.elevatorsStartX + options.elevatorMargin + (index * (options.elevatorWidth + 2 * options.elevatorMargin));
      var elevatorStartY = options.elevatorsStartY + options.elevatorMargin + ((state.levels.length - elevator.currentLevel - 1) * (options.elevatorHeight + 2 * options.elevatorMargin));
      var elevatorEndX = elevatorStartX + options.elevatorWidth;
      var elevatorEndY = elevatorStartY + options.elevatorHeight;

      // elevator boxes
      ctx.strokeStyle = renderer.elevatorColor;
      ctx.fillStyle = renderer.elevatorColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(elevatorStartX, elevatorStartY, options.elevatorWidth, options.elevatorHeight);

      // label
      ctx.font="lighter 10px Arial";
      ctx.fillText(index + 1, elevatorStartX + (options.elevatorWidth / 2) - 3.5, elevatorStartY - 4);

      // holder
      var holderWidth = 20;
      var holderHeight = 15;
      var holderStartX = elevatorStartX + (options.elevatorWidth / 2) - (holderWidth / 2);
      var holderStartY = elevatorStartY - holderHeight;

      ctx.lineWidth = 1;
      ctx.strokeRect(holderStartX, holderStartY, holderWidth, holderHeight);

      ctx.beginPath();
      ctx.moveTo(holderStartX + (holderWidth / 2), holderStartY);
      ctx.lineTo(holderStartX + (holderWidth / 2), 0);
      ctx.stroke();
    }
  }

  renderer.drawLevels = function(canvas, ctx, state, options) {
    ctx.restore();
    ctx.strokeStyle = renderer.levelColor;
    ctx.fillStyle = renderer.levelColor;
    ctx.lineWidth = 1;

    for (var index = 0; index < state.levels.length; index++) {
      var level = state.levels[index];

      var levelStartX = options.levelsStartX;
      var levelStartY = options.levelsStartY + ((state.levels.length - index - 1) * options.levelHeight);
      var levelEndX = levelStartX + options.levelsWidth;
      var levelEndY = levelStartY + options.levelHeight;

      // base line
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(levelStartX, levelEndY);
      ctx.lineTo(levelEndX, levelEndY);
      ctx.stroke();

      // label
      ctx.font="lighter 15px Arial";
      ctx.fillText(index, levelStartX + 7, levelStartY + (options.levelHeight / 2) + 7);
    }
  }

  renderer.drawPeople = function(canvas, ctx, state, options) {
    
  }

  renderer.getRenderingInterval = function() {
    return Math.floor(1000 / renderer.frameRate);
  }

  return renderer;
}();