document.addEventListener('DOMContentLoaded', function(){ 
  initialize();
}, false);

function initialize() {
  console.log("Initializing");

  var canvas = document.getElementById("canvas");
  renderer.initializeCanvas(canvas);
}