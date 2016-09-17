var looper = function(){

  var looper = {
  };

  looper.loopInterval = 10;
  looper.loopIntervalObject;

  looper.currentTimeStamp = 0;
  looper.loopTimeStampDelta = 1000;

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

    if (looper.currentTimeStamp % 500000 == 0) {
      console.log(new Date(looper.currentTimeStamp));
    }
  }

  looper.processPeople = function() {
    for (var personIndex = 0; personIndex < looper.state.people.length; personIndex++) {
      var person = looper.state.people[personIndex];

      // check if person needs to get to work
      if (person.shouldBeAtWork() && !person.isAtWorkLevel()) {
        //console.log("Person wants to get to work") //+ " - from " + person.currentLevel + " to " + person.workLevel);
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
      //elevator.currentLevel = Math.round(elevator.currentLevel * 100) / 100;

      if (elevator.isAtLevel()) {
        if (elevator.shouldStop()) {
          elevator.stop();
          elevator.removeTargetLevel(elevator.getLevel().id);

          var level = elevator.getLevel();
          level.resetUp();
          level.resetDown(); // TODO: remove only one!
          
          // let people from level enter the elevator
          for (var personIndex = 0; personIndex < level.people.length; personIndex++) {
            if (!elevator.canAddPerson()) {
              break;
            }

            var person = looper.state.people[personIndex];

            // add person and person's target level to elevator
            elevator.addPerson(person);
            elevator.addTargetLevel(person.getTargetLevel());

            // remove person from level
            level.removePerson(person);
            console.log("Person " + person.id + " entered elevator " + elevator.id + " on level " + level.id + ", target: " + person.getTargetLevel());
          }

          // let people exit the elevator
          for (var personIndex = 0; personIndex < elevator.people.length; personIndex++) {
            var personId = elevator.people[personIndex];
            var person = looper.state.people[personId];
            if (level.id != person.getTargetLevel()) {
              continue;
            }            

            // update the current level
            person.currentLevel = level.id;

            // remove person from elevator
            elevator.removePerson(person);

            // add person to level
            level.addPerson(person);
            console.log("Person " + person.id + " exited elevator " + elevator.id + " on level " + level.id);
          }

          continue;
        }
      }

      elevator.move();
    }
  }

  return looper;
}();

















