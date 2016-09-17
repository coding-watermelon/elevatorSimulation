document.addEventListener('DOMContentLoaded', function(){ 
  initialize();
}, false);

var state = null

function initialize() {
  console.log("Initializing");

  var canvas = document.getElementById("canvas");
  renderer.initializeCanvas(canvas);

  // TODO: start generating data

  var state = generateFakeState();
  console.log(state);

  renderer.setLatestState(state);
  renderer.renderLatestState();
  //renderer.startRenderingStates();
  startLoop()
}

function generateFakeState() {
  var peopleCount = 100;
  var elevatorCount = 5;
  var levelCount = 5;
  var initialState = generator.init(peopleCount, elevatorCount, levelCount);

  for (var elevatorIndex = 0; elevatorIndex < initialState.elevators.length; elevatorIndex++) {
    var people = Math.floor(Math.random() * 10);
    for (var peopleIndex = 0; peopleIndex < people; peopleIndex++) {
      initialState.elevators[elevatorIndex].people.push(peopleIndex);
    }
    var level = Math.floor(Math.random() * (initialState.levels.length - 1));
    initialState.elevators[elevatorIndex].currentLevel = level;
  }

  for (var levelIndex = 0; levelIndex < initialState.levels.length; levelIndex++) {
    var people = Math.floor(Math.random() * 10);
    for (var peopleIndex = 0; peopleIndex < people; peopleIndex++) {
      initialState.levels[levelIndex].people.push(peopleIndex);
    }
  }
  
  return initialState;
}