document.addEventListener('DOMContentLoaded', function(){ 
  initialize();
}, false);

function initialize() {
  console.log("Initializing");

  var canvas = document.getElementById("canvas");
  renderer.initializeCanvas(canvas);

  var initialState = generateInitialState();
  console.log(initialState);

  smartLogic.initialize(initialState);

  var logic = randomLogic;

  looper.initialize(initialState, logic);
  looper.setSpeedFactor(getUrlParam("speedFactor", 20));

  looper.startLooping();
  renderer.startRenderingStates();
}

// generates a state that will be used for
// initializing the looper
function generateInitialState() {
  var peopleCount = getUrlParam("peopleCount", 20);
  var elevatorCount = getUrlParam("elevatorCount", 4);
  var levelCount = getUrlParam("levelCount", 6);
  var initialState = generator.initialize(peopleCount, elevatorCount, levelCount);  
  return initialState;
}

// generates a state that can be used to test
// the state rendering
function generateFakeState() {
  var initialState = generateInitialState();

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

function getRandomNumberBetween(minMin, maxMin) {
  return Math.floor(Math.random() * (maxMin - minMin + 1)) + minMin;
}

function getUrlParam(sParam, defaultValue) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
  return defaultValue;
}