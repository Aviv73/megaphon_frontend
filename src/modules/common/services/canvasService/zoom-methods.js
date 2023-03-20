import  { Utils } from './utils.js';

function setZoomDomEvMethods() {
  // handling will zoom event
  this.elCanvas.addEventListener('wheel', (ev) => {
      ev.preventDefault();
      if (!ev.wheelDelta) return;
      this.updateZoomLevel(ev.wheelDelta > 0 ? 0.1 : -0.1, this.constructor.getOffsetPosFomDomEvent(ev));
  })

  // handling touch zoom event
  let prevTouchZoomDist = null;
  this.elCanvas.addEventListener('touchmove', (ev) => {
      ev.preventDefault();
      if (ev.touches.length < 2) return;
      if (this.isDragOn) this.isDragOn = false;
      const [touch1, touch2] = ev.touches;
      const dist = Math.hypot(touch1.pageX - touch2.pageX, touch1.pageY - touch2.pageY);
      if (!prevTouchZoomDist) return prevTouchZoomDist = dist;
      const diff = prevTouchZoomDist - dist;
      const canvasOffsetPos = Utils.getElPosOnScreen(this.elCanvas);
      this.updateZoomLevel(diff < 0 ? 0.025 : -0.025, {
          x: (touch1.clientX + touch2.clientX) / 2 - canvasOffsetPos.x,
          y: (touch1.clientY + touch2.clientY) / 2 - canvasOffsetPos.y
      });
      prevTouchZoomDist = dist;
  });
  this.elCanvas.addEventListener('toucend', (ev) => {
      ev.preventDefault();
      if (ev.touches.length < 2) return;
      prevTouchZoomDist = null;
  });

  // handling drag events
  let prevDragPos = null;
  ['mousedown', 'touchstart'].forEach(evName => this.elCanvas.addEventListener(evName, (ev) => {
      ev.preventDefault();
      if (ev.touches && ev.touches.length > 1) return;
      if (this.zoomLevel === 1) return;
      prevDragPos = this.constructor.getOffsetPosFomDomEvent(ev, true);
      this.isDragOn = true;
      this.elCanvas.style.cursor = 'grabbing';
  }));
  ['mousemove', 'touchmove'].forEach(evName => this.addWindowEventListener(evName, (ev) => {
      // ev.preventDefault();
      if (!this.isDragOn) return;
      let dragPos = this.constructor.getOffsetPosFomDomEvent(ev, true);
      if (!prevDragPos) return prevDragPos = dragPos;
      this.updateRootRenderPos({
          x: (prevDragPos.x - dragPos.x),
          y: (prevDragPos.y - dragPos.y)
      });
      prevDragPos = dragPos;
  }));
  ['mouseup', 'touchend', 'touchcancel'].forEach(evName => this.addWindowEventListener(evName, (ev) => { // 'mouseout'
      // ev.preventDefault();
      prevDragPos = null;
      this.isDragOn = false;
      // this.elCanvas.style.cursor = 'grab';
      this.elCanvas.style.cursor = '';
  }));

  // adding zoom and scroll ui elements if required;
  if (this.canvasOpts.enableScrollUi || this.canvasOpts.enableZoomUi || this.canvasOpts.enableFlipUi || this.canvasOpts.enableMirrorUi) this.elCanvasContainer.appendChild(this.getActionsElement());
}

function updateRootRenderPos(diffs = { x: 0, y: 0 }, isStrictPos = false) {
  const { rootRenderPos, boardToCanvasRatio } = this;
  diffs.x /= boardToCanvasRatio;
  diffs.y /= boardToCanvasRatio;
  rootRenderPos.x = isStrictPos? diffs.x : rootRenderPos.x+diffs.x;
  rootRenderPos.y = isStrictPos? diffs.y : rootRenderPos.y+diffs.y;
  this.validateRootRenderPos();
  this.setScrollSize();
  this.resetMapedStaticShapesToRender();
  this.render();
}
function validateRootRenderPos() {
  const { rootRenderPos, viewdArea, renderedCanvasSize, canvasSize, boardSize, boardToCanvasRatio } = this;  
  // const maxView = this.convertBoardSizeToCanvasSize({x: renderedCanvasSize.w - canvasSize.w , y: renderedCanvasSize.h - canvasSize.h}, true);
  const maxView = {
      x: (renderedCanvasSize.w - canvasSize.w) / boardToCanvasRatio,
      y: (renderedCanvasSize.h - canvasSize.h) / boardToCanvasRatio
  }
  if (viewdArea.startX < 0) rootRenderPos.x = 0;
  if (viewdArea.startY < 0) rootRenderPos.y = 0;
  if (viewdArea.endX > boardSize.w) rootRenderPos.x = maxView.x;
  if (viewdArea.endY > boardSize.h) rootRenderPos.y = maxView.y;
}

function updateZoomLevel(diff = 0, canvasPos) {
  const { canvasSize, lastZoomPos } = this;
  if (!canvasPos) canvasPos = lastZoomPos || { x: canvasSize.w/2, y: canvasSize.h/2 };
  const prevLevel = this.zoomLevel;
  this.zoomLevel += diff;
  if (this.zoomLevel < 1) this.zoomLevel = 1;
  if (this.zoomLevel > 5) this.zoomLevel = 5;
  if (prevLevel === this.zoomLevel) return;

  const actualDiff = this.zoomLevel - prevLevel;

  const posRatiToCanvas = {
      w: canvasPos.x / canvasSize.w,
      h: canvasPos.y / canvasSize.h
  }
  const renderPosDiffs = {
      x: (canvasSize.w * posRatiToCanvas.w),
      y: (canvasSize.h * posRatiToCanvas.h)
  }
  if (lastZoomPos) {
      renderPosDiffs.x += (canvasPos.x - lastZoomPos.x);
      renderPosDiffs.y += (canvasPos.y - lastZoomPos.y);
  }
  renderPosDiffs.x *= actualDiff;
  renderPosDiffs.y *= actualDiff;

  // if ((diff < 0) && lastZoomPos) {   // flipping pos
  //     if (lastZoomPos.x !== canvasPos.x) renderPosDiffs.x = canvasSize.w - renderPosDiffs.x;
  //     if (lastZoomPos.y !== canvasPos.y) renderPosDiffs.y = canvasSize.h - renderPosDiffs.y;
  // }
  
  if (this.zoomLevel === 1) this.lastZoomPos = null;
  else this.lastZoomPos = canvasPos;

  this.updateRootRenderPos(renderPosDiffs, false);
}

function setScrollSize() {
  let { scrollSizes, canvasRootRenderPos, renderedCanvasSize, canvasSize } = this;
  if (!scrollSizes) this.scrollSizes = scrollSizes = { vertical: { pad: 0, size: 0 }, horizontal: { pad: 0, size: 0 } };
  scrollSizes.vertical.pad = (canvasRootRenderPos.y / renderedCanvasSize.h) * 100;
  scrollSizes.horizontal.pad = (canvasRootRenderPos.x / renderedCanvasSize.w) * 100;
  scrollSizes.vertical.size = canvasSize.w / renderedCanvasSize.w * 100;
  scrollSizes.horizontal.size = canvasSize.h / renderedCanvasSize.h * 100;
  this.updateElScrollsStyle();
}

export default {
  setZoomDomEvMethods,
  updateRootRenderPos,
  validateRootRenderPos,
  updateZoomLevel,
  setScrollSize
}