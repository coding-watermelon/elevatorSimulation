// Loop
// Iterate over people
// 	Check if they want to get to a different level
// 	Set level requests accordingly

// Iterate over levels
// 	Request elevators (Logic is called here! Pushes to targetLevel Array)

// Iterate over elevators (set new current level)
// 	Check wait timeout (reduce or change current level)
// 	Fire event if reached a target level
// 		Let people enter / exit elevator 
let EXIT = false
let LOOP_DURATION = 10 // Milliseconds one loop iteration represents
let ELEVATOR_TIMEOUT = 2000 // Timeout of elevator in Milliseconds

// Defines Point in Time
let now = 0
let state = null

function startLoop(){
  if(!state)
    throw "Error - State not yet defined"

  while(!EXIT){

    // Check people for changing level and fire event also calls logic
    iteratePeople()

    // Iterate through elevators and set new position accordingly
    iterateElevators()

    now += LOOP_DURATION
  }


  function iteratePeople(){
    for(var index in state.people){
      let person = state.people[index]

      // If person is coming to work or coming back from break
      if(now > person.workStartTime && now < person.breakStartTime || 
         now > person.breakStopTime && now < person.workStopTime){
        state.levels[person.workLevel].requestUp()
      } // if person is going to break or going home
      else if (
        now > person.breakStartTime && now < person.breakStopTime || 
        now > person.workStopTime ) {
          state.levels[person.workLevel].requestDown()
        }

    }
  }

  function iterateElevators(){
    for(var index in state.elevators){
      let elevator = state.elevators[index]

      // If elevator currently stays at one level and is busy
      if(elevator.waitTimeout > 0){
        elevator.waitTimeout = Math.max(0, elevator.waitTimeout - LOOP_DURATION)
        continue;
      }

      // Get next level of elevator
      
      // sort targetLevels in descending order
      elevator.targetLevels = elevator.targetLevels.sort(function(a,b){return b-a})
      
      // Find out the next target level the elevator goes to
      var nextLevel = -1;
      for(var targetIndex in elevator.targetLevels){
        let level = elevator.targetLevels[targetIndex]
        if(elevator.direction == 'up'){
          if(elevator.currentLevel < level && (nextLevel == -1 || nextLevel > level)){
            nextLevel = level
          }
        }else{
          if(elevator.currentLevel > level && (nextLevel == -1 || nextLevel < level)){
            nextLevel = level
          }
        }
      }

      if(elevator.direction == 'up'){
        elevator.moveUp(LOOP_DURATION / 1000)
      }else{
        elevator.moveDown(LOOP_DURATION / 1000)
      }


      if(elevator.direction == 'up' && elevator.currentLevel > nextLevel){
        elevator.currentLevel = nextLevel
        elevator.waitTimeout = ELEVATOR_TIMEOUT

      }else if(elevator.direction == 'down' && elevator.currentLevel < nextLevel){
        elevator.currentLevel = nextLevel
        elevator.waitTimeout = ELEVATOR_TIMEOUT
      }
      
    }
  }

}
