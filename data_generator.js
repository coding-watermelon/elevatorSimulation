'use strict'

const MAX_NUMBER_OF_PEOPLE = 16;
const ELEVATOR_SPEED = 2

function generatePeople(count){
  let people = []
  

  for(var i=0; i<count; i++){
    let person = {}
    person.id = i

    // Time represented as number of minutes after 0 o clock 
    // is number between 0 and 1440
    // Starttime between 8 o clock and 10 o clock
    person.workStartTime = rand(480, 600) 
    
    // Between 12 am and 2 pm
    person.breakStartTime = rand(720, 840)
    person.breakStopTime = person.breakStartTime + 45

    // Between 8 and 10 hours after start
    person.workStopTime = person.workStartTime + rand(480, 600)

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



