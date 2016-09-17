'use strict'
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

console.log( generatePeople(10) )

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}