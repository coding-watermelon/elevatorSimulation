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
  
  logic.onElevatorUpRequested = function(level) {
    console.log("onElevatorUpRequested");
    seconds = getSecondsOfTheDay(looper.currentTimeStamp)
    logic.model[seconds][level]++
  }

  logic.onElevatorDownRequested = function(level) {
    console.log("onElevatorDownRequested");
    seconds = getSecondsOfTheDay(looper.currentTimeStamp)
    logic.model[seconds][level]++
  }

  logic.onTargetLevelsChanged = function(currentState, elevator, targetLevels) {
    //go to target levels one after another
  }

  logic.onElevatorIdle = function(elevator) {
    //stay on the level
    //console.log("onElevatorIdle");
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
