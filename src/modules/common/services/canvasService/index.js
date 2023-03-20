/**
 * TODO:
 *  * Fix memory lick (serch in file: 'FIX FOR MEMORY LICK');
 */


import setupMethods from './setup-methods.js';
import getters from './getters.js';
import renderMethods from './render-methods.js';
import boardMethods from './board-methods.js';
import ratioMethods from './ratio-methods.js';
import zoomMethods from './zoom-methods.js';
import flipMethods from './flip-methods.js';
import zoomUiMethods from './zoom-ui.js';
import windowEvMethods from './window-event-methods.js';

export class CanvasService {
    static id = 0;
    static imgSrcMap = {};
    
    elParent = null;
    element = null;
    elCanvas = null;
    context = null;
    isDragOn = false;
    scrollSizes = null;
    lastZoomPos = null;
    zoomLevel = 1;
    rootRenderPos = { x: 0, y: 0 };
    isRenderData = true;
    windowEvsMap = {};
    resizeObserver = null;
    intervals = {};
    isMirrorX = false;
    isMirrorY = false;
    inited = false;
    mapedStaticShapesToRender = [];
    
    constructor( 
        board = [],
        canvasOpts = { 
            selector: 'body',
            context: null,
            bgc: 'white',
            enableZoom: false,
            enableScrollUi: false,
            enableZoomUi: false,
            enableFlipUi: false,
            enableMirrorUi: false,
            initZoomLevel: 1,
            initRootRenderPos: { x: 0, y: 0 },
            loadImgCb: null,
            enableAnimation: false,
            flipLevel: 1,
            grid: {
                x: 0,
                y: 0,
                style: {}
            }
        },
        getCellContectCb = null, // (cell = {}, drawOpts = {x: 0, y: 0}, context = CanvasRenderingContext2D) => RenderOpts
        listeners = {}
        ) {
    
        this.id = 'fucking-legendary-canvas-' + this.constructor.id++;
        this.board = board;
        this.canvasOpts = canvasOpts;
        this.getCellContectCb = getCellContectCb;
        this.listeners = listeners;
        
        this.setup();
    
        this.inited = true;
    }

  
  // Setup methods
  setup = setupMethods.setup;
  init = setupMethods.init;


  // Getters

  get selector() {return getters.selector.call(this)};
  get isMatrixBoard() {return getters.isMatrixBoard.call(this)};
  get boardSize() {return getters.boardSize.call(this)};
  get boardToCanvasRatio() {return getters.boardToCanvasRatio.call(this)};
  get cellSizeByboardToCanvasRatio() {return getters.cellSizeByboardToCanvasRatio.call(this)};
  get renderedCanvasSize() {return getters.renderedCanvasSize.call(this)};
  get viewdArea() {return getters.viewdArea.call(this)};
  get canvasRootRenderPos() {return getters.canvasRootRenderPos.call(this)};
  get isServeMode() {return getters.isServeMode.call(this)};


  // Methods

  // render methods
  static parseRenderOpts = renderMethods.parseRenderOpts;
  fixRenderOptsStyle = renderMethods.fixRenderOptsStyle;
  getRenderOpts = renderMethods.getRenderOpts;
  renderShape = renderMethods.renderShape;
  loadImage = renderMethods.loadImage;
  doRenderData = renderMethods.doRenderData;
  renderCell = renderMethods.renderCell;
  getDynamicRenderOpts = renderMethods.getDynamicRenderOpts;
  getAutoStaticShapes = renderMethods.getAutoStaticShapes;
  resetMapedStaticShapesToRender = renderMethods.resetMapedStaticShapesToRender;
  getStaticShapesToRender = renderMethods.getStaticShapesToRender;
  render = renderMethods.render;
  lastRenderData = null; // { timeout, at, render };
  debounceRender = renderMethods.debounceRender;

  // board update methods
  set board(board) {return boardMethods.boardSetter.call(this, board)};
  get board() {return boardMethods.boardGetter.call(this)};
  doUpdateCell = boardMethods.doUpdateCell;
  updateCell = boardMethods.updateCell;
  updateCells = boardMethods.updateCells;
  removeCell = boardMethods.removeCell;
  updateBoard = boardMethods.updateBoard;
  reqAnimations = {};
  nextAnimateId = 0;
  doAnimationCellUpdate = boardMethods.doAnimationCellUpdate;
  static getGridLines = boardMethods.getGridLines;
  
  // ratio methods
  getPosOpts = ratioMethods.getPosOpts;
  // convertBoardPosToCanvasPos = ratioMethods.convertBoardPosToCanvasPos;
  convertBoardSizeToCanvasSize = ratioMethods.convertBoardSizeToCanvasSize;
  getDrawOpts = ratioMethods.getDrawOpts;
  getBoardPosFromCanvasDomEvent = ratioMethods.getBoardPosFromCanvasDomEvent;
  static getOffsetPosFomDomEvent(ev, isClientPos) {return ratioMethods.getOffsetPosFomDomEvent(ev, isClientPos)};
  calcCanvasSize = ratioMethods.calcCanvasSize;

  // zoom methods
  setZoomDomEvMethods = zoomMethods.setZoomDomEvMethods;
  updateRootRenderPos = zoomMethods.updateRootRenderPos;
  validateRootRenderPos = zoomMethods.validateRootRenderPos;
  updateZoomLevel = zoomMethods.updateZoomLevel;
  setScrollSize = zoomMethods.setScrollSize;

  // Flip methods
  flipItem = flipMethods.flipItem;
  updateFlipLevel = flipMethods.updateFlipLevel;
  set flipLevel(level) {return flipMethods.flipLevelSetter.call(this, level)};
  get flipLevel() {return flipMethods.flipLevelGetter.call(this)};
  toggleMirrorX = flipMethods.toggleMirrorX;
  toggleMirrorY = flipMethods.toggleMirrorY;
  get isSizeFlipped() {return flipMethods.isSizeFlipped.call(this)};

  // scroll and zoom ui methods
  updateElScrollsStyle = zoomUiMethods.updateElScrollsStyle;
  getActionsElement = zoomUiMethods.getActionsElement;
  setElActionPositions = zoomUiMethods.setElActionPositions;
  static getActionsStyleStr = zoomUiMethods.getActionsStyleStr;

  
  // window events methods
  addWindowEventListener = windowEvMethods.addWindowEventListener;
  removeWindowEventListeners = windowEvMethods.removeWindowEventListeners;
  setResizeEvents = windowEvMethods.setResizeEvents;

  static isPosOnItem = boardMethods.isPosOnItem;
}