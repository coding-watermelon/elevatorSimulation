var dumb_logic = function(){

  var logic = {
  };

  logic.onElevatorIsUpRequested = function(currentState, currentLevel) {
    //send closest unused elevator or elevator that will visit the level anyways
  }

  logic.onElevatorIsDownRequested = function(currentState, currentLevel) {
    //send closest unused elevator or elevator that will visit the level anyways
  }

  logic.onTargetLevelsChanged = function(currentState, elevator, targetLevels) {
    //go to target levels one after another
  }

  logic.onElevatorGotIdle = function(currentState) {
    //stay on the level
  }
