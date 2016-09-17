document.addEventListener('DOMContentLoaded', function(){ 
  initialize();
}, false);

function initialize() {
  console.log("Initializing");

  var canvas = document.getElementById("canvas");
  renderer.initializeCanvas(canvas);

  // TODO: start generating data

  var peopleCount = 100;
  var elevatorCount = 5;
  var levelCount = 7;
  
  var initialState = generator.init(peopleCount, elevatorCount, levelCount);
  console.log(initialState);

  renderer.setLatestState(initialState);
  //renderer.startRenderingStates();
}