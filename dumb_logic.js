var dumbLogic = function(){

  var logic = {
  };

  logic.onElevatorUpRequested = function(level) {
    //send closest unused elevator or elevator that will visit the level anyways
    console.log("onElevatorUpRequested");
  }

  logic.onElevatorDownRequested = function(level) {
    //send closest unused elevator or elevator that will visit the level anyways
    console.log("onElevatorDownRequested");
  }

  logic.onTargetLevelsChanged = function(currentState, elevator, targetLevels) {
    //go to target levels one after another
  }

  logic.onElevatorIdle = function(elevator) {
    //stay on the level
    //console.log("onElevatorIdle");
  }

  return logic;
}();