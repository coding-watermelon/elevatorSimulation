var renderer = function(){

  var renderer = {
  };

  renderer.frameRate = 30;
  renderer.renderingInterval = renderer.getRenderingInterval();

  renderer.initializeCanvas(canvas) {
    console.log("Initializing canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer.canvas = canvas;
  }
  
  renderer.shouldRenderState = function(state) {
    
  }

  renderer.renderState = function(state) {
  	renderer.renderStateOnCanvas(state, renderer.canvas);
  }

  renderer.renderStateOnCanvas = function(state, canvas) {
    renderer.lastRenderingTimestamp = Date.now();
    renderer.lastRendererState = state;
  }

  renderer.getRenderingInterval = function() {
    return Math.floor(1000 / renderer.frameRate);
  }

  return renderer;
}();