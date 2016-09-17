var smartLogic = function(){

  var logic = {
  };

  model = {}
  //Map every second on most frequent level
  for(var t = 0; t < 86400; t++) {
    model[t] = {}
      for(var levelIndex = 0; levelIndex < looper.state.levels.length; levelIndex++) {
        model[t][levelIndex] = 0
      }
  }
  logic.model = model

  logic.onElevatorUpRequested = function(level) {
    console.log("onElevatorUpRequested");
    seconds = getSecondsOfTheDay(looper.currentTimeStamp)
    logic.model[seconds][level]++
    console.log(model)
  }

  logic.onElevatorDownRequested = function(level) {
    console.log("onElevatorDownRequested");
    seconds = getSecondsOfTheDay(looper.currentTimeStamp)
    logic.model[seconds][level]++
    console.log(model)
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
