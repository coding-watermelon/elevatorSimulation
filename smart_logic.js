var smartLogic = function(){

  var BATCH_COUNT = 60 * 60 * 24;

  var logic = {
  };

  logic.initialize = function(initialState) {
    // map every second on most frequent level
    var model = {};

    for(var batchIndex = 0; batchIndex < BATCH_COUNT; batchIndex++) {
      model[batchIndex] = {};
      for(var levelIndex = 0; levelIndex < initialState.levels.length; levelIndex++) {
        model[batchIndex][levelIndex] = 0;
      }
    }
    logic.model = model
  }

  logic.getLevelScore = function(level) {
    var currentRequests = logic.model[getSecondsOfTheDay(looper.currentTimeStamp)];
    var requestSum = 0;
    for(var levelIndex = 0; levelIndex < currentRequests.length; levelIndex++) {
      requestSum += currentRequests[levelIndex]
    }
    if(requestSum == 0) {
      return 0;
    }
    return currentRequests[level]/requestSum;
  }

  function getNearestElevatorIndex(level) {
    var nearestElevatorIndex = 0
    var minimalDistance = Math.abs(looper.state.elevators[nearestElevatorIndex].currentLevel - level.id)
    for (var i = 0; i < looper.state.elevators.length; i++) {
        if(Math.abs(looper.state.elevators[i].currentLevel - level.id) < minimalDistance) {
            minimalDistance = Math.abs(looper.state.elevators[i].currentLevel - level.id)
            nearestElevatorIndex = i
        }
    }
    //console.log('Nearest elevator for level ' + level + ' is elevator ' + nearestElevatorIndex)
    return nearestElevatorIndex
  }
  
  logic.onElevatorUpRequested = function(level) {
    console.log("onElevatorUpRequested");
    seconds = getSecondsOfTheDay(looper.currentTimeStamp)
    logic.model[seconds][level.id]++
    looper.state.elevators[getNearestElevatorIndex(level)].addTargetLevel(level.id);
  }

  logic.onElevatorDownRequested = function(level) {
    console.log("onElevatorDownRequested");
    seconds = getSecondsOfTheDay(looper.currentTimeStamp)
    logic.model[seconds][level.id]++
    looper.state.elevators[getNearestElevatorIndex(level)].addTargetLevel(level.id);
  }

  logic.onTargetLevelsChanged = function(currentState, elevator, targetLevels) {
    //go to target levels one after another
  }

  logic.onElevatorIdle = function(elevator) {
    //move to most frequented level
    console.log("onElevatorIdle");
    currentSeconds = getSecondsOfTheDay(looper.currentTimeStamp)
    maxRequests = 0
    maxRequestsIndex = 0
    for(levelIndex = 0; levelIndex < logic.model[currentSeconds].length; levelIndex++) {
      if(logic.model[currentSeconds][levelIndex] > maxRequests) {
        maxRequests = logic.model[currentSeconds][levelIndex]
        maxRequestsIndex = levelIndex
      }
    }
    looper.state.elevators[elevator.id].addTargetLevel(maxRequestsIndex);
  }

  logic.onElevatorStopped = function(elevator) {
    //console.log("onElevatorStopped");
  }

  function getSecondsOfTheDay(timestamp) {
    var dt = new Date(timestamp)
    return dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours())
  }

  return logic;
}();
