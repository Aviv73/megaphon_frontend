

// setup: This function setup all the data and elements of the service
function setup() {
  if (this.isServeMode) return this.init();

  const  { canvasOpts } = this;

  const elParent = this.elParent = document.querySelector(canvasOpts.selector);
  // if (this.element) try { elParent.removeChild(this.element); } catch (e) { elParent.innerHTML = '' }
  elParent.innerHTML = '';
  const elCanvasContainer = document.createElement('div');
  this.elCanvasContainer = elCanvasContainer;
  elCanvasContainer.style = 'position:relative;display:flex;align-items:center;justify-content:center;';
  elCanvasContainer.id = this.id;
  this.element = elCanvasContainer;
  
  const elCanvas = document.createElement('canvas');
  this.context = elCanvas.getContext('2d');
  this.elCanvas = elCanvas;

  elCanvasContainer.appendChild(elCanvas);
  elParent.appendChild(elCanvasContainer);        

  for (let evName in this.listeners) {
      if (evName === 'render') continue;
      elCanvas.addEventListener(evName, (ev) => {
          const pos = this.flipItem(this.getBoardPosFromCanvasDomEvent(ev))
          this.listeners[evName](ev, { x: pos.x, y: pos.y }, this);
      });
  }
  if (canvasOpts.enableZoom) this.setZoomDomEvMethods();
  
  this.init();

  this.setResizeEvents();
  
  if (canvasOpts.initZoomLevel) this.updateZoomLevel(canvasOpts.initZoomLevel - this.zoomLevel);
  if (canvasOpts.initRootRenderPos) this.updateRootRenderPos(this.convertBoardSizeToCanvasSize(canvasOpts.initRootRenderPos));
  if (canvasOpts.flipLevel) this.updateFlipLevel(canvasOpts.flipLevel, true);
}

// init: inits all the dynamic sizes and renders the canvas
function init() {
  if (this.isServeMode) {
      this.canvasSize = { ...this.boardSize };
      this.context = this.canvasOpts.context;
      this.render();
      return;
  }
  const canvasSize = this.calcCanvasSize();
  this.canvasSize = canvasSize;
  this.elCanvas.width = canvasSize.w;
  this.elCanvas.height = canvasSize.h;
  // this.mapedStaticShapesToRender = null;
  this.setScrollSize();
  this.setElActionPositions();
  this.resetMapedStaticShapesToRender();
  this.render();
}


export default {
  setup,
  init
}