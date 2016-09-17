'use strict'

var generator = function(){
  const MAX_NUMBER_OF_PEOPLE = 16;
  const ELEVATOR_SPEED = 2

  let generator = {}
  let people = []
  

  generator.init = function(peopleCount, elevatorCount, levelCount){
    return {
      people: generatePeople(peopleCount),
      elevator: generateElevator(elevatorCount),
      level: generateLevel(levelCount)
    }
  }

  function generatePeople(count){
    let people = []
    var startTimeDistribution = gaussian(540, 60)
    var stopTimeDistribution = gaussian(780, 60)

    for(var i=0; i<count; i++){
      let person = {}
      person.id = i

      // Time represented as number of minutes after 0 o clock 
      // is number between 0 and 1440
      if (Math.random() < 0.05) {
        //Create an outlier
        //Between 0 and 11 am
        person.workStartTime = rand(0, 660)

        //Between 11 am and 3 pm
        person.breakStartTime = rand(660, 900)
        // Between 20 and 60 minutes
        person.breakStopTime = Math.floor(Math.random() * 41) + 20;

        // Between 7 and 11 hours after start
        person.workStopTime = person.workStartTime + rand(420, 660)
      } else {
        // Between 8 o clock and 10 o clock
        person.workStartTime = startTimeDistribution()
        
        // Between 12 am and 2 pm
        person.breakStartTime = stopTimeDistribution()
        person.breakStopTime = person.breakStartTime + 45

        // Between 8 and 10 hours after start
        person.workStopTime = person.workStartTime + startTimeDistribution()
      }
      people.push(person)
    }
    return people
  }

  function rand(minMin, maxMin) {
    minMin = minMin * 60 * 1000
    maxMin = maxMin * 60 * 1000

    return Math.floor(Math.random() * (maxMin - minMin + 1)) + minMin;
  }

  function generateLevel(count){
    let level = []

    for(var i=0; i<count; i++){
      let currLevel = {
        id: i,
        people: [],
        elevatorUpRequested: false,
        elevatorDownRequested: false
      }
      level.push(currLevel)
    }

    return level
  }

  function generateElevator(count){
    let elevators = []

    for(var i=0; i<count; i++){
      let elevator = {
        id: i,
        maximumNumberOfPeople: MAX_NUMBER_OF_PEOPLE,
        people: [],
        currLevel: 0,
        targetLevels: [],
        speed: ELEVATOR_SPEED,
        waitTimeout: 0
      }
      elevators.push(elevator)
    }

    return elevators
  }


  // returns a gaussian random function with the given mean and standard deviation
  function gaussian(mean, stdev) {
      mean = mean * 60 * 1000;
      stdev = stdev * 60 * 1000;
      
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
}()

console.log( generator.init(3,3,3) )