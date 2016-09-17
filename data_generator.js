'use strict'

var generator = function(){
  const MAX_NUMBER_OF_PEOPLE = 9;
  const WAIT_TIMEOUT = 5 * 1000;
  const ELEVATOR_SPEED = (1 / 5) / 1000;
  const BREAK_LEVEL = 0

  let generator = {}
  let people = []
  

  generator.initialize = function(peopleCount, elevatorCount, levelCount){
    var state = {
      people: generatePeople(peopleCount, levelCount),
      elevators: generateElevators(elevatorCount),
      levels: generateLevels(levelCount)
    }

    for (var personIndex = 0; personIndex < state.people.length; personIndex++) {
      state.levels[0].people.push(state.people[personIndex].id);
    }

    return state;
  }

  function generatePeople(count, levelCount){
    let people = []
    var startTimeDistribution = gaussian(getMillisecondsFromTime(9), getMillisecondsFromTime(1))
    var breakTimeDistribution = gaussian(getMillisecondsFromTime(13), getMillisecondsFromTime(1))

    for(var i=0; i<count; i++){
      let person = {}
      person.id = i

      var generateOutlier = Math.random() < 0.05;
      if (generateOutlier) {
        person.workStartTime = gaussian(getMillisecondsFromTime(5), getMillisecondsFromTime(3))
        person.breakStartTime = person.workStartTime + gaussian(getMillisecondsFromTime(4), getMillisecondsFromTime(3))
        person.breakStopTime = person.breakStartTime + gaussian(getMillisecondsFromTime(0.5), getMillisecondsFromTime(0.45));
        person.workStopTime = person.breakStopTime + gaussian(getMillisecondsFromTime(4), getMillisecondsFromTime(3));
      } else {
        person.workStartTime = startTimeDistribution()
        person.breakStartTime = breakTimeDistribution()
        person.breakStopTime = person.breakStartTime + getMillisecondsFromTime(0.75)
        person.workStopTime = person.workStartTime + startTimeDistribution()
      }
      person.workLevel = getRandomNumberBetween(1, levelCount-1)
      person.breakLevel = 0;
      person.currentLevel = 0;
      person.isInElevator = false;
      person.isWaitingForElevator = false;
      person.waitingTime = 0;

      person.shouldHaveABreak = function(timestamp) {
        if (timestamp > person.breakStartTime && timestamp < person.breakStopTime) {
          return true;
        } else {
          return false;
        }
      }

      person.shouldBeAtWork = function(timestamp) {
        if (timestamp < person.workStartTime || timestamp > person.workStopTime) {
          return false;
        }
        return !person.shouldHaveABreak(timestamp);
      }

      person.isAtWorkLevel = function() {
        return person.currentLevel == person.workLevel;
      }

      person.isAtBreakLevel = function() {
        return person.currentLevel == BREAK_LEVEL;
      }

      person.getTargetLevel = function() {
        if (person.shouldBeAtWork() && person.currentLevel != person.workLevel) {
          return person.workLevel;
        } else {
          return person.breakLevel;
        }
      }

      person.requestElevatorUp = function() {
        looper.state.levels[person.currentLevel].requestElevatorUp();
        person.isWaitingForElevator = true;
      }

      person.requestElevatorDown = function() {
        looper.state.levels[person.currentLevel].requestElevatorDown();
        person.isWaitingForElevator = true;
      }

      people.push(person)
    }
    return people
  }

  function generateLevels(count){
    let levels = []

    for(var i=0; i<count; i++){
      let currentLevel = {
        id: i,
        people: [],
        elevatorUpRequested: false,
        elevatorDownRequested: false
      }

      currentLevel.requestElevatorUp = function(){
        if(!currentLevel.elevatorUpRequested){
          currentLevel.elevatorUpRequested = true
          looper.logic.onElevatorUpRequested(currentLevel)
        }
      }

      currentLevel.requestElevatorDown = function(){
        if(!currentLevel.elevatorDownRequested){
          currentLevel.elevatorDownRequested = true
          looper.logic.onElevatorDownRequested(currentLevel)
        }
      }

      currentLevel.resetUp = function(){
        currentLevel.elevatorUpRequested = false
      }

      currentLevel.resetDown = function(){
        currentLevel.elevatorDownRequested = false
      }

      currentLevel.addPerson = function(person){
        if(currentLevel.people.indexOf(person.id) == -1) {
          currentLevel.people.push(person.id)
        }
      }
      currentLevel.removePerson = function(person){
        currentLevel.people = removeElementFromArray(person.id, currentLevel.people);
      }

      levels.push(currentLevel);
    }

    return levels
  }

  function generateElevators(count){
    let elevators = []

    for(var i=0; i<count; i++){
      let elevator = {
        id: i,
        maximumNumberOfPeople: MAX_NUMBER_OF_PEOPLE,
        people: [],
        currentLevel: 0,
        targetLevels: [],
        speed: ELEVATOR_SPEED,
        movingUp: false,
        waitTimeout: 0
      }

      elevator.canAddPerson = function() {
        return elevator.people.length + 1 <= elevator.maximumNumberOfPeople
      }

      elevator.addPerson = function(person){
        if (!elevator.canAddPerson()) {
          return false;
        }
        if(elevator.people.indexOf(person.id) == -1) {
          elevator.people.push(person.id)
          person.isInElevator = true;
          return true;
        }
        return false;
      }

      elevator.removePerson = function(person){
        elevator.people = removeElementFromArray(person.id, elevator.people);
      }

      elevator.addTargetLevel = function(levelIndex){
        if(elevator.targetLevels.indexOf(levelIndex) == -1) {
          elevator.targetLevels.push(levelIndex)
        }
      }

      elevator.removeTargetLevel = function(level){
        elevator.targetLevels = removeElementFromArray(level, elevator.targetLevels);
      }

      elevator.move = function() {
        if (elevator.waitTimeout > 0) {
          elevator.waitTimeout -= looper.loopTimeStampDelta
          elevator.waitTimeout = Math.max(0, elevator.waitTimeout);
          return;
        }

        if (elevator.shouldMoveUp()) {
          elevator.moveUp();
          return;
        }

        if (elevator.shouldMoveDown()) {
          elevator.moveDown();
          return;
        }

        looper.logic.onElevatorIdle(elevator);
      }

      elevator.shouldMoveUp = function() {
        if (elevator.targetLevels.length < 1) {
          return false;
        }
        return elevator.targetLevels[0] > elevator.currentLevel;
      }

      elevator.moveUp = function(){
        elevator.currentLevel += elevator.speed * looper.loopTimeStampDelta;
      }

      elevator.shouldMoveDown = function() {
        if (elevator.targetLevels.length < 1) {
          return false;
        }
        return elevator.targetLevels[0] < elevator.currentLevel;
      }

      elevator.moveDown = function(){
        elevator.currentLevel -= elevator.speed * looper.loopTimeStampDelta;
        Math.max(elevator.currentLevel, 0);
      }

      elevator.isAtLevel = function() {
        return elevator.getLevel() != null;
      }

      elevator.getLevel = function() {
        var roundedCurrentLevel = Math.round(elevator.currentLevel * 100) / 100;
        if (roundedCurrentLevel % 1 == 0) {
          return looper.state.levels[roundedCurrentLevel];
        }
        return null;
      }

      elevator.shouldStop = function() {
        return elevator.shouldStopAtLevel(elevator.getLevel());
      }

      elevator.shouldStopAtLevel = function(level) {
        if (elevator.targetLevels.length < 1) {
          // has no target levels
          return false;
        } else if (elevator.waitTimeout > 0) {
          // elevator already stopped
          return false;
        } else {
          return elevator.targetLevels[0] == level.id;
        }
      }

      elevator.stop = function() {
        elevator.waitTimeout = WAIT_TIMEOUT;
        looper.logic.onElevatorStopped(elevator);
      }

      elevators.push(elevator)
    }

    return elevators
  }

  function removeElementFromArray(element, array) {
    var index = array.indexOf(element);
    if (index != -1) {
      array.splice(index, 1);
    }
    return array;
  }

  function getMillisecondsFromTime(hour) {
    return hour * 60 * 60 * 1000;
  }

  // returns a gaussian random function with the given 
  // mean and standard deviation
  function gaussian(mean, stdev) {      
      var y2;
      var use_last = false;
      return function() {
          var y1;
          if(use_last) {
            y1 = y2;
            use_last = false;
          }
          else {
              var x1, x2, w;
              do {
                  x1 = 2.0 * Math.random() - 1.0;
                  x2 = 2.0 * Math.random() - 1.0;
                  w  = x1 * x1 + x2 * x2;               
              } while( w >= 1.0);
              w = Math.sqrt((-2.0 * Math.log(w))/w);
              y1 = x1 * w;
              y2 = x2 * w;
              use_last = true;
        }

        var retval = mean + stdev * y1;
        if(retval > 0) 
            return Math.round(retval);
        return -Math.round(retval);
    }
  }

  return generator;
}();