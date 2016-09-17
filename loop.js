var looper = function(){

  var looper = {
  };

  looper.loopInterval = 100;
  looper.loopIntervalObject;

  looper.currentTimeStamp = 0;
  looper.loopTimeStampDelta = 10000;

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
    looper.state.timestamp = looper.currentTimeStamp;
    renderer.setLatestState(looper.state);

    if (looper.currentTimeStamp % 100000 == 0) {
      console.log(new Date(looper.currentTimeStamp));
    }
  }

  looper.processPeople = function() {
    for (var personIndex = 0; personIndex < looper.state.people.length; personIndex++) {
      var person = looper.state.people[personIndex];

      // check if person needs to get to work
      if (person.shouldBeAtWork() && !person.isAtWorkLevel()) {
        console.log("Person wants to get to work") //+ " - from " + person.currentLevel + " to " + person.workLevel);
        if (person.currentLevel > person.workLevel) {
          person.requestElevatorDown();
        } else if (person.currentLevel < person.workLevel) {
          person.requestElevatorUp();
        }
        continue;
      }

      // check if person needs to have a break
      if (person.shouldHaveABreak() && !person.isAtBreakLevel()) {
        console.log("Person wants to have a break");
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
    for (var elevatorIndex = 0; elevatorIndex < looper.state.elevators.length; elevatorIndex++) {
      var elevator = looper.state.elevators[elevatorIndex];

      // round current elevator level
      elevator.currentLevel = Math.round(elevator.currentLevel * 100) / 100;

      if (elevator.isAtLevel()) {
        if (elevator.shouldStopAtLevel()) {
          elevator.stop();
          // TODO: exchange people

          var level = elevator.getLevel();
          for (var personIndex = 0; personIndex < level.people; personIndex++) {
            if (!elevator.canAddPerson()) {
              break;
            }

            var person = level.people[personIndex];
            elevator.addPerson();
            level.removePerson(person);
            console.log("Person entered elevator");
          }

          continue;
        }
      }

      elevator.move();
    }
  }

  return looper;
}();

















