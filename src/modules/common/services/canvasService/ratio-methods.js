import { MathService } from './utils.js';

function getPosOpts(pos = { x: 0, y: 0 }) {
  const { w: cellW, h: cellH } = this.cellSizeByboardToCanvasRatio;
  let { x, y } = this.convertBoardSizeToCanvasSize(pos);

  x -= this.canvasRootRenderPos.x;
  y -= this.canvasRootRenderPos.y;

  return { x: x, y: y, actualX: x - cellW / 2, actualY: y - cellH / 2 };
}

function convertBoardSizeToCanvasSize(size = { w: 1, h: 1, x: 0, y: 0 }, isFromCanvasPos = false) {
  const { w: ratio } = this.cellSizeByboardToCanvasRatio;
  const res = {};
  for (let key in size) {
      res[key] = !isFromCanvasPos? size[key] * ratio : size[key] / ratio;
  }
  return res;
}

function getDrawOpts(opts = { x: 0, y: 0, w: 1, h: 1 }) {
  const centerPos = this.getPosOpts({ x: opts.x+opts.w/2, y: opts.y+opts.h/2 });
  return {
      boardPos: { x: opts.x, y: opts.y },
      ...this.getPosOpts({ x: opts.x, y: opts.y }),
      ...this.convertBoardSizeToCanvasSize({ w: opts.w, h: opts.h }),
      centerX: centerPos.x,
      centerY: centerPos.y,
      zoomLevel: this.zoomLevel
  };
}

function getBoardPosFromCanvasDomEvent(ev) {
  let { x: offsetX, y: offsetY } = this.constructor.getOffsetPosFomDomEvent(ev);

  const { boardSize, canvasSize, canvasRootRenderPos } = this;

  offsetX += canvasRootRenderPos.x;
  offsetY += canvasRootRenderPos.y;

  const heightDivider = boardSize.h / (canvasSize.h * this.zoomLevel);
  const widthDivider = boardSize.w / (canvasSize.w * this.zoomLevel);

  const x = offsetX * widthDivider;
  const y = offsetY * heightDivider;

  return { x, y };
}

function getOffsetPosFomDomEvent(ev, isClientPos) {
  if (isClientPos && ev.clientX) return { x: ev.clientX, y: ev.clientY };
  return (typeof ev.offsetX === 'number')
      ? { x: ev.offsetX, y: ev.offsetY }
      : {
          x: ev.touches[0].clientX - ev.touches[0].target.offsetLeft,
          y: ev.touches[0].clientY - ev.touches[0].target.offsetTop
      };
}

function calcCanvasSize() {
  const { boardSize, elParent } = this;
  const elementSize = {
      w: elParent.offsetWidth,
      h: elParent.offsetHeight
  }
  const renderSize = MathService.fitParentSize(elementSize, boardSize);
  if (this.isSizeFlipped) renderSize.w = renderSize.h*(renderSize.h/renderSize.w);
  return renderSize;
}


export default {
  getPosOpts,
  convertBoardSizeToCanvasSize,
  getDrawOpts,
  getBoardPosFromCanvasDomEvent,
  getOffsetPosFomDomEvent,
  calcCanvasSize
}