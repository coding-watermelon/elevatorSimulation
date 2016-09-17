var simpleLogic = function(){

  var logic = {
  };

  function getNearestElevatorIndex(level) {
    var nearestElevatorIndex = 0
    var minimalDistance = Math.abs(looper.state.elevators[nearestElevatorIndex].currentLevel - level)
    for (var i = 0; i < looper.state.elevators.length; i++) {
        if(Math.abs(looper.state.elevators[i].currentLevel - level) < minimalDistance) {
            minimalDistance = Math.abs(looper.state.elevators[i].currentLevel - level)
            nearestElevatorIndex = i
        }
    }
    console.log('Nearest elevator for level ' + level + ' is elevator ' + nearestElevatorIndex)
    return nearestElevatorIndex
  }

  logic.onElevatorUpRequested = function(level) {
    //send closest unused elevator or elevator that will visit the level anyways
    console.log("onElevatorUpRequested");
    looper.state.elevators[getNearestElevatorIndex].addTargetLevel(level.id);
  }

  logic.onElevatorDownRequested = function(level) {
    //send closest unused elevator or elevator that will visit the level anyways
    console.log("onElevatorDownRequested");
    looper.state.elevators[getNearestElevatorIndex].addTargetLevel(level.id);
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

  return logic;
}();