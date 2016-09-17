var renderer = function(){

  var renderer = {
  };

  renderer.frameRate = 60;
  renderer.renderingInterval;
  renderer.renderingIntervalObject;

  renderer.lastRenderingTimestamp = 0;
  renderer.lastRenderedState;
  renderer.latestState;

  renderer.primaryColor = "#388E3C";
  renderer.primaryColorLight = "#43A047";
  renderer.primaryColorDark = "#2E7D32";
  renderer.secondaryColor = "#FBC02D";

  renderer.elevatorColor = "#FFFFFF";
  renderer.levelColor = "#FFFFFF";
  renderer.statsColor = "#FFFFFF";
  renderer.whiteOverlay = "rgba(255, 255, 255, 0.33)";


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
      //return false;
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
      //console.log("Skipping state rendering");
    }
  }

  renderer.renderStateOnCanvas = function(state, canvas) {
    //console.log("Rendering state:");
    //console.log(state);

    try {
      var ctx = canvas.getContext("2d");
      var options = renderer.getDrawOptions(canvas, state);
      renderer.drawBase(canvas, ctx, state, options);
      renderer.drawLevels(canvas, ctx, state, options);
      renderer.drawElevators(canvas, ctx, state, options);
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
    options.levelsWidth = Math.round(canvas.width * 0.75);
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

    var minimumPeopleWidth = 5;
    options.peopleMargin = 2;
    options.elevatorContentWidth = options.elevatorWidth - (2 * options.elevatorPadding);
    options.peoplePerElevatorRow = Math.floor(options.elevatorContentWidth / (minimumPeopleWidth + (3 * options.peopleMargin)));
    options.peopleWidth = Math.round(options.elevatorContentWidth / options.peoplePerElevatorRow);
    
    options.levelContentWidth = (options.levelsWidth - options.elevatorsWidth) / 2;
    options.peoplePerLevelRow = Math.floor(options.levelContentWidth / (options.peopleWidth + (3 * options.peopleMargin)));
    options.maximumPeoplePerLevel = options.peoplePerLevelRow * 4;

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

    // time
    ctx.font="lighter 15px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = renderer.statsColor;
    var time = new Date(state.timestamp).toLocaleTimeString();
    ctx.fillText(time, canvas.width - 100, 30);

    ctx.textAlign = "center";
    var speed = Math.round(looper.loopTimeStampDelta / looper.loopInterval) + "x";
    ctx.fillText(speed, 80, 30);
    
    ctx.save();
  }

  renderer.drawElevators = function(canvas, ctx, state, options) {
    ctx.restore();
    ctx.strokeStyle = renderer.elevatorColor;
    ctx.fillStyle = renderer.elevatorColor;
    ctx.setLineDash([]);

    // frame
    //ctx.strokeRect(options.elevatorsStartX, options.elevatorsStartY, options.elevatorsWidth, options.elevatorsHeight);

    for (var index = 0; index < state.elevators.length; index++) {
      var elevator = state.elevators[index];

      var elevatorStartX = options.elevatorsStartX + options.elevatorMargin + (index * (options.elevatorWidth + 2 * options.elevatorMargin));
      var elevatorStartY = options.elevatorsStartY + options.elevatorMargin + ((state.levels.length - elevator.currentLevel - 1) * (options.elevatorHeight + 2 * options.elevatorMargin));
      var elevatorEndX = elevatorStartX + options.elevatorWidth;
      var elevatorEndY = elevatorStartY + options.elevatorHeight;

      // holder
      var holderWidth = 15;
      var holderHeight = holderWidth;
      var holderStartX = elevatorStartX + (options.elevatorWidth / 2) - (holderWidth / 2);
      var holderStartY = elevatorStartY - holderHeight;

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(holderStartX + holderWidth / 2, holderStartY + holderHeight, holderWidth, 1 * Math.PI, 2 * Math.PI);
      ctx.fillStyle = renderer.primaryColorDark;
      ctx.fill();
      ctx.stroke();

      // holder line
      ctx.beginPath();
      ctx.moveTo(holderStartX + (holderWidth / 2), holderStartY);
      ctx.lineTo(holderStartX + (holderWidth / 2), 0);
      ctx.stroke();

      // elevator box
      ctx.strokeStyle = renderer.elevatorColor;
      ctx.lineWidth = 1.5;
      ctx.fillRect(elevatorStartX, elevatorStartY, options.elevatorWidth, options.elevatorHeight);
      ctx.strokeRect(elevatorStartX, elevatorStartY, options.elevatorWidth, options.elevatorHeight);

      // label
      ctx.font="lighter 10px Arial";
      ctx.textAlign = "center"; 
      ctx.fillStyle = renderer.elevatorColor;
      ctx.fillText(index + 1, elevatorStartX + (options.elevatorWidth / 2), elevatorStartY - 4);
      ctx.lineWidth = 1;

      // people
      for (var peopleIndex = 0; peopleIndex < elevator.people.length; peopleIndex++) {
        var rowIndex = peopleIndex % (options.peoplePerElevatorRow - 1);
        var collumnIndex = Math.floor(peopleIndex / (options.peoplePerElevatorRow - 1));
        var offsetX = rowIndex * (options.peopleWidth + (2 * options.peopleMargin)) + options.peopleMargin;
        var offsetY = collumnIndex * (options.peopleWidth + (2 * options.peopleMargin)) + options.peopleMargin;
        
        var peopleStartX = elevatorStartX + options.elevatorPadding + offsetX;
        var peopleStartY = elevatorEndY - options.elevatorMargin - options.elevatorPadding - offsetY;

        ctx.fillStyle = renderer.primaryColorLight;
        ctx.fillRect(peopleStartX, peopleStartY, options.peopleWidth, options.peopleWidth);
        ctx.strokeRect(peopleStartX, peopleStartY, options.peopleWidth, options.peopleWidth);
      }
    }
  }

  renderer.drawLevels = function(canvas, ctx, state, options) {
    ctx.restore();
    ctx.strokeStyle = renderer.levelColor;
    ctx.fillStyle = renderer.levelColor;
    ctx.lineWidth = 1;

    var getLevelName = function(index) {
      switch (index) {
        case 0:
          return "Ground";
        case 1:
          return "1st floor";
        case 2:
          return "2nd floor";
        case 3:
          return "3rd floor";
        default:
          return index + "th floor";
      }
    }

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
      ctx.fillStyle = renderer.whiteOverlay;
      ctx.textAlign = "left";
      ctx.font = "lighter 14px Arial";
      var levelName = getLevelName(index);
      ctx.fillText(levelName, levelEndX + 5, levelEndY + 4);

      ctx.setLineDash([]);
      ctx.lineWidth = 1;

      // people
      var waitingCount = 0;
      for (var peopleIndex = 0; peopleIndex < level.people.length; peopleIndex++) {
        var person = state.people[level.people[peopleIndex]];
        if (person.isWaitingForElevator) {
          waitingCount++;
          ctx.fillStyle = renderer.primaryColorLight;
        } else {
          ctx.fillStyle = renderer.primaryColorDark;
        }

        if (peopleIndex >= options.maximumPeoplePerLevel) {
          continue;
        }

        var rowIndex = peopleIndex % (options.peoplePerLevelRow);
        var collumnIndex = Math.floor(peopleIndex / (options.peoplePerLevelRow));
        var offsetX = rowIndex * (options.peopleWidth + (2 * options.peopleMargin)) + options.peopleMargin;
        var offsetY = collumnIndex * (options.peopleWidth + (2 * options.peopleMargin)) + options.peopleMargin;
        
        var peopleStartX = levelEndX - options.levelContentWidth + offsetX;
        var peopleStartY = levelEndY - (2 * options.elevatorMargin) - options.elevatorPadding - offsetY;

        ctx.fillRect(peopleStartX, peopleStartY, options.peopleWidth, options.peopleWidth);
        ctx.strokeRect(peopleStartX, peopleStartY, options.peopleWidth, options.peopleWidth);
      }

      // counts
      ctx.fillStyle = renderer.whiteOverlay;
      ctx.font = "lighter 40px Arial";
      var waitingCountWidth = ctx.measureText(waitingCount).width;
      ctx.fillText(waitingCount, levelStartX + 7, levelStartY + (options.levelHeight / 2) + 10);

      ctx.font = "lighter 14px Arial";
      ctx.fillText("people waiting", levelStartX + 15 + waitingCountWidth, levelStartY + (options.levelHeight / 2) - 9);
      ctx.fillText(level.people.length - waitingCount + " total", levelStartX + 15 + waitingCountWidth, levelStartY + (options.levelHeight / 2) + 9);
    }
  }

  renderer.drawPeople = function(canvas, ctx, state, options) {
    
  }

  renderer.getRenderingInterval = function() {
    return Math.floor(1000 / renderer.frameRate);
  }

  return renderer;
}();