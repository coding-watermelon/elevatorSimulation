var smart_logic = function(){

  var logic = {
  };

  logic.onElevatorIsUpRequested = function(currentState, currentLevel) {
    //send elevator which currently is on the level which is the least frequently used
  }

  logic.onElevatorIsDownRequested = function(currentState, currentLevel) {
    //send elevator which currently is on the level which is the least frequently used
  }

  logic.onTargetLevelsChanged = function(currentState, elevator, targetLevels) {
    //weight target levels by the score how frequent they're used
  }

  logic.onElevatorGotIdle = function(currentState) {
    //go to level which is currently the most frequently used
  }
