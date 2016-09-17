var smart_logic = function(){

  var logic = {
  };

  logic.onElevatorRequested = function(currentState, isUpRequested) {
    //send elevator which currently is on the level which is the least frequently used
  }

  logic.onTargetLevelsRequested = function(currentState, targetLevels) {
    //weight target levels by the score how frequent they're used
  }

  logic.onTargetLevelsReached = function(currentState) {
    //go to level which is currently the most frequently used
  }
