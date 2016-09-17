document.addEventListener('DOMContentLoaded', function(){ 
  initialize();
}, false);

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
}

function generateFakeState() {
  var peopleCount = getUrlParam("peopleCount", 100);
  var elevatorCount = getUrlParam("elevatorCount", 4);
  var levelCount = getUrlParam("levelCount", 6);
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