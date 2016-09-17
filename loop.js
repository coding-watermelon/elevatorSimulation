var looper = function(){

  var looper = {
  };

  looper.loopInterval = 10;
  looper.loopIntervalObject;

  looper.currentTimeStamp = 0;
  looper.loopTimeStampDelta = 100;

  looper.state;
  looper.logic;

  looper.initialize = function(initialState, logic) {
    looper.state = initialState;
    looper.logic = logic;
  }

  looper.startLooping = function() {
    console.log("Starting looping");
    renderer.loopIntervalObject = window.setInterval(looper.loop, looper.loopInterval);
  }

  looper.stopLooping = function() {
    console.log("Stopping looping");
    window.clearInterval(looper.loopIntervalObject);
  }

  looper.loop = function() {
    looper.processPeople();
    looper.processElevators();
    looper.currentTimeStamp += looper.loopTimeStampDelta;
  }

  looper.processPeople = function() {
    for (var personIndex = 0; personIndex < looper.state.people.length; personIndex++) {
      var person = looper.state.people[personIndex];
      
      // check if person needs to get to work
      if (person.shouldBeAtWork() && !person.isAtWorkLevel()) {
        if (person.currentLevel > person.breakLevel) {
          person.requestElevatorDown();
        } else if (person.currentLevel < person.breakLevel) {
          person.requestElevatorUp();
        }
        continue;
      }

      // check if person needs to have a break
      if (person.shouldHaveABreak() && !person.isAtBreakLevel()) {
        if (person.currentLevel > person.breakLevel) {
          person.requestElevatorDown();
        } else if (person.currentLevel < person.breakLevel) {
          person.requestElevatorUp();
        }
        continue;
      }
    }
  }

  looper.processElevators = function() {

  }

  return looper;
}