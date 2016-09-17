var randomLogic = function(){

  var logic = {
  };

  logic.onElevatorUpRequested = function(level) {
    //send closest unused elevator or elevator that will visit the level anyways
    console.log("onElevatorUpRequested");

    // pick a random elevator and add the target level
    var elevatorIndex = getRandomNumberBetween(0, looper.state.elevators.length - 1);
    looper.state.elevators[elevatorIndex].addTargetLevel(level.id);
  }

  logic.onElevatorDownRequested = function(level) {
    //send closest unused elevator or elevator that will visit the level anyways
    console.log("onElevatorDownRequested");

    // pick a random elevator and add the target level
    var elevatorIndex = getRandomNumberBetween(0, looper.state.elevators.length - 1);
    looper.state.elevators[elevatorIndex].addTargetLevel(level.id);
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