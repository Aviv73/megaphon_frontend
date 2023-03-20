function selector() {
  return '#' + this.id;
}

function isMatrixBoard() {
  return Array.isArray(this.board);
}

function boardSize() {
  const { board } = this;

  const boardHeight = board.height || board.length;
  const boardWidth = board.width || board[0].length;

  return { w: boardWidth, h: boardHeight };
}

function boardToCanvasRatio() {
  return this.canvasSize.w / this.boardSize.w;
}

function cellSizeByboardToCanvasRatio() {
  const { w: canvasWidth, h: canvasHeight } = this.canvasSize;
  const { w: boardWidth, h: boardHeight } = this.boardSize;

  let h = canvasHeight / boardHeight;
  let w = canvasWidth / boardWidth;

  h *= this.zoomLevel;
  w *= this.zoomLevel;

  return { w, h };
}

function renderedCanvasSize() {
  const { zoomLevel, canvasSize } = this;
  return {
      w: canvasSize.w * zoomLevel,
      h: canvasSize.h * zoomLevel
  }
}

function viewdArea() {
  const { rootRenderPos, canvasSize, zoomLevel } = this;

  const startX = rootRenderPos.x / zoomLevel;
  const startY = rootRenderPos.y / zoomLevel;

  const consvertedCanvasSize = this.convertBoardSizeToCanvasSize(canvasSize, true);
  const endX = startX + consvertedCanvasSize.w;
  const endY = startY + consvertedCanvasSize.h;

  return { startX, startY, endX, endY };
}

function canvasRootRenderPos() {
  const { rootRenderPos, boardToCanvasRatio } = this;
  return {
      x: rootRenderPos.x*boardToCanvasRatio,
      y: rootRenderPos.y*boardToCanvasRatio
  }
}

// This getter tells if the service is used to serve an exist  given canvas instead of creating one;
function isServeMode() {
  return this.canvasOpts.context && true;
}


export default {
  selector,
  isMatrixBoard,
  boardSize,
  boardToCanvasRatio,
  cellSizeByboardToCanvasRatio,
  renderedCanvasSize,
  viewdArea,
  canvasRootRenderPos,
  isServeMode
}