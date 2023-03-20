/**
 * TODO:
 *  * Canvas vertical rotation
 *  * Fix grid lines rotate
 */


/**
 * README.md file::
 * 

 # Canvas Service
The role of this service is to help with canvas rendering and paint logic

the canvas service needs to get a parent element selector to know where to be rendered

## Documentation

Example for service usage:
```javascript
const canvasService = new CanvasService(board, canvasOptions, renderShapeCb, listeners);

canvasService.updateCells(shapes, optional findIndexCb) // use to add new shapes / update an existed ones
canvasService.removeCell(shapeFindIndexOrCb);           // use to remove shape 
canvasService.updateBoard(newBoard);                    // use to upfate the given board


canvasService.removeWindowEventListeners(); // after removing canvas element / destroy

```

Example for canvasOptions param (the only required one is the selector):
```java script
const canvasOptions = { 
    selector: 'body', // required!
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
        space: 50,
        style: {
            // linePattern: [10, 10]
        // }
    }
}
```


examples for boards can be sent to the service:
```java script
const matrixBoard = [
     ['*', '*', '*'],
     ['*', '*', '*'],
     ['*', '*', RenderOpts],
 ];

 const nonMatrixBoard = {  //  (better)
    width: 100,
    height: 100,
    shapes: [RenderOpts],     // shapes and static shapes are the same, but shapes are dynamicly rendered in each render
    staticShapes: [RenderOpts]
 };
```

Example for shape render opts:

<br /> Enumerator: One of opts | example: Enumerator('north', 'west') means you can put 'north'/'west' as the value of the property
<br /> Range: A number between | example: Range(0, 100) means you can put any number between 1 and 100 as the value of the property

all the strict properties are the same of their non strict, but wont be changed to ratio;


```java script
 const RenderOpts = {
    hide: Boolean,
    style: {      // most props are simply canvas style properties 
        fillStyle: String,   // color
        strokeStyle: String, // color
        lineWidth: Number,
        strictLineWidth: Number,
        font: String('Ariel'),
        textAlign: Enumerator('center', 'right', 'left'),
        textBaseline: Enumerator('middle', 'top', 'bottom'),
        gradientBgc: {
            colors: [
                { offset: 0, val: 'rgba(255,255,255,1)' },
                { offset: 1, val: 'rgba(255,255,255,0)' },
            ],
            angle: Range(0, 360),
            autoCalcGeoShapeSize: Boolean // for geoShape, is has no w/h properties so needed to auto calc
        // linePattern: [Number], // for setLineDash context method;
        // strictLinePattern: [Number], // for setLineDash context method;
        circleCounterClockWise: Boolean,
        lineCap: Enumerator('round'),
        clear: Boolean // to clear the given shape
    },
    img: Enumerator(String('SOME_IMG.src'), ElementImage),  // for image rendering
    text: String,                                           // for text rendernig
    geoShape: [{X: Number, y: Number}],                     // for geoshape rendering
    circleDegries: Range(0, 360),                                 // [StartDeg, endDeg]     // for circle rendering
    closeCircle: Boolean,                                   // to close the circle to its center
    grid: {                                                 // for grid lines rendering inside the shape (paints a rect)
        x: { space, align, strictSpace, rotate, style }, 
        y: {}, 
        space: Number,                                  // the space between the grid lines
        align: Enumerator('start', 'center', 'end' ),
        style,                  // same as RenderOpts.style prop
        rotate: Number,         // the rotation/degries of the grid lines; STILL IN DEVELOPMENT;
        strictSpace: Number
    },

    zIndex: Number,   //  the controll the order of the shapes in the z axis;

    // mirror: Boolean,        
    // flip: Boolean,

    scale: [x, y],          // number values for contex.scale property
    strictScale: [x, y],
    dontScale: Boolean,     // to force the shape not to scale, even if canvas rotated 

    x: Number,          // pos on x axis
    y: Number,          // pos on y axis
    w: Number,          // shape width
    h: Number,          // shape height
    rotate: Range(0, 360), // shape roation around it self
    isCenterPos: Boolean,  // tells if the pos refers to the top-left corner or, if true, to its center
    
    strictW: Number,
    strictH: Number,
    strictX: Number,
    strictY: Number,
    strictR: Number, // strict rotate

    children: [RenderOpts] // nested opts - position are relative to parent, no rotation; works fine for cercle and geoShape (as children)
}
```


Example for renderShapeCb param (optional) - used to render shapes dynamicly without changing the board:
<br />shape is each cell in the board mat, or each shape the board shapes;
<br />drawOpts are the render properties after calcing it whth the oard to canvas ratio;
<br />context is a canvas.context object;
<br />the function needs to return a RenderOpts object or an array of ones;
```java script
const renderCb = (shape, drawOpts, context, service) => {
    const res = [
        {
            img: 'space_ship.png', isCenterPos: true
        }
    ]
    if (shape.code === selectedItemCode) {
        res.push(
            {x: shape.x + shape.w, y: shape.y, w: 25, text: `${shape.x}, ${shape.y}`}
        );
    }
    return res;
}
```


Example for listeners param (optiobal):
```java script
const listeners = {
    click(ev, pos) {
        console.log(pos);
        const item = findItemByPos(pos);
        if (item) console.log(item);
    },
    render() { // costume event
        console.log('rendered!');
    },
    mousemove(ev, pos) {
        const item = findItemByPos(pos);
        if (item) {
            selectedItemCode = item.code;
            canvasService.elCanvas.style.cursor = 'pointer';
        } else {
            canvasService.elCanvas.style.cursor = 'default';
        }
    }
}
```
*/



// module.exports.CanvasService = class CanvasService {
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
    
    // setup: This function setup all the data and elements of the service
    setup() {
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
    init() {
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
    
    
    // Getters

    // the service's html selector
    get selector() {
        return '#' + this.id;
    }
    
    get isMatrixBoard() {
        return Array.isArray(this.board);
    }
    
    // gives the board size after checking if it is matrix or reg mod
    get boardSize() {
        const { board } = this;
    
        const boardHeight = board.height || board.length;
        const boardWidth = board.width || board[0].length;

        return { w: boardWidth, h: boardHeight };
    }
    
    // The ratio between the canvas width and the original board width;
    get boardToCanvasRatio() {
        return this.canvasSize.w / this.boardSize.w;
    }
    
    // The ratio between the canvas size and the board size, calced with the canvas zoom level;
    get cellSizeByboardToCanvasRatio() {
        const { w: canvasWidth, h: canvasHeight } = this.canvasSize;
        const { w: boardWidth, h: boardHeight } = this.boardSize;
        
        // const scale = window.devicePixelRatio || 1;
        // let h = canvasHeight / boardHeight * scale;
        // let w = canvasWidth / boardWidth * scale;

        let h = canvasHeight / boardHeight;
        let w = canvasWidth / boardWidth;
    
        h *= this.zoomLevel;
        w *= this.zoomLevel;
    
        return { w, h };
    }
    
    // the size of the canvas if it was rendered in full zoom size
    get renderedCanvasSize() {
        const { zoomLevel, canvasSize } = this;
        return {
            w: canvasSize.w * zoomLevel,
            h: canvasSize.h * zoomLevel
        }
    }

    // the area of the board that is visible to the user after zoom
    get viewdArea() {
        const { rootRenderPos, canvasSize, zoomLevel } = this;
    
        const startX = rootRenderPos.x / zoomLevel;
        const startY = rootRenderPos.y / zoomLevel;
    
        const consvertedCanvasSize = this.convertBoardSizeToCanvasSize(canvasSize, true);
        const endX = startX + consvertedCanvasSize.w;
        const endY = startY + consvertedCanvasSize.h;
    
        return { startX, startY, endX, endY };
    }
    
    // The position that init the render (is changed if the canvas is zoomed in, val will be under 0 for both x and y, this way only a part of the board is visible);
    get canvasRootRenderPos() {
        const { rootRenderPos, boardToCanvasRatio } = this;
        return {
            x: rootRenderPos.x*boardToCanvasRatio,
            y: rootRenderPos.y*boardToCanvasRatio
        }
    }

    // This getter tells if the service is used to serve an exist  given canvas instead of creating one;
    get isServeMode() {
        return this.canvasOpts.context && true;
    }
    
    
    // Methods
    
    
    // render methods

    // parse all the shape and input renderOpts to one renderOpts item;
    static parseRenderOpts(shape = {}, reqOpts = {}, relativeTo) {
        shape = Utils.copy(shape);
        reqOpts = Utils.copy(reqOpts);
        const res = {
            hide: shape.hide,
            x: shape.x,
            y: shape.y,
            w: shape.w,
            h: shape.h,
            zIndex: shape.zIndex || 0,
            rotate: shape.rotate,
            isCenterPos: shape.isCenterPos || ((shape.circleDegries || reqOpts.circleDegries) && true),
            geoShape: shape.geoShape,
            img: shape.img,
            circleDegries: shape.circleDegries,
            closeCircle: shape.closeCircle,
            text: shape.text,
            strictW: shape.strictW,
            strictH: shape.strictH,
            strictX: shape.strictX,
            strictY: shape.strictY,
            strictR: shape.strictR,
            mirror: shape.mirror,
            scale: shape.scale,
            strictScale: shape.strictScale,
            dontScale: shape.dontScale,
            style: shape.style && {
                fillStyle: shape.style.fillStyle,
                strokeStyle: shape.style.strokeStyle,
                font: shape.style.font,
                lineWidth: shape.style.lineWidth,
                strictLineWidth: shape.style.strictLineWidth,
                textAlign: shape.style.textAlign,
                textBaseline: shape.style.textBaseline,
                // linePattern: shape.style.linePattern,
                // strictLinePattern: shape.style.strictLinePattern,
                circleCounterClockWise: shape.style.circleCounterClockWise,
                lineCap: shape.style.lineCap,
                clear: shape.style.clear,
                shadowBlur: shape.style.shadowBlur,
                shadowColor: shape.style.shadowColor,
                shadowOffsetX: shape.style.shadowOffsetX,
                shadowOffsetY: shape.style.shadowOffsetY,
                fontWeight: shape.style.fontWeight // normal/ bold / bolder / lighter
            } || {},
            grid: shape.grid && {
                style: shape.grid.style,
                align: shape.grid.align,
                space: shape.grid.space,
                strictSpace: shape.grid.strictSpace,
                rotate: shape.grid.rotate,
                x: shape.grid.x && (typeof(shape.grid.x) === 'object') && {
                    space: shape.grid.x.space,
                    strictSpace: shape.grid.x.strictSpace,
                    style: shape.grid.x.style,
                    align: shape.grid.x.align,
                    rotate: shape.grid.x.rotate,
                } || shape.grid.x,
                y:  shape.grid.y && (typeof(shape.grid.y) === 'object') && {
                    strictSpace: shape.grid.y.strictSpace,
                    space: shape.grid.y.space,
                    style: shape.grid.y.style,
                    align: shape.grid.y.align,
                    rotate: shape.grid.y.rotate,
                } || shape.grid.y,
            },
            flip: 'flip' in shape? shape.flip : true,
            children: shape.children || [],
            ...reqOpts,
        }
        if (res.circleDegries && !Array.isArray(res.circleDegries)) res.circleDegries = [0, res.circleDegries];
        if (relativeTo) {
            // const _valid = val => (val && (typeof val === 'number'));
            [ ['strictX', 'x'], ['strictY', 'y'], ['strictR', 'rotate']].forEach(keys => {
                const [strictKey, key] = keys;
                const isInRel = relativeTo[key] !== undefined;
                const isStrict = relativeTo[strictKey] !== undefined;
                if (!isInRel && !isStrict) return;
                if (isStrict) res[strictKey] = relativeTo[strictKey] + ((typeof res[strictKey] === 'number')? res[strictKey] : res[key] || 0); 
                else res[key] = relativeTo[key] + (res[key] || 0);
            });
        }
        return res;
    }

    fixRenderOptsStyle(opts) {
        const ratioW = this.cellSizeByboardToCanvasRatio.w;
        const _fixStyle = (_style) => {
            if (_style.linePattern) _style.linePattern = _style.linePattern.map(c => c*ratioW);
            if (_style.lineWidth) _style.lineWidth *= ratioW;
            if (_style.shadowBlur) _style.shadowBlur *= ratioW;
            if (_style.shadowOffsetX) _style.shadowOffsetX *= ratioW;
            if (_style.shadowOffsetY) _style.shadowOffsetY *= ratioW;
            return _style;
        }
        _fixStyle(opts.style);
        if (opts.grid) {
            if (opts.grid.style) opts.grid.style = _fixStyle({...opts.grid.style});
            opts.grid.space *= ratioW;
            if (typeof(opts.grid.x) === 'object') {
                opts.grid.x.space *= ratioW;
                if (opts.grid.x.style) opts.grid.x.style = _fixStyle({...opts.grid.x.style});
            } else opts.grid.x *= ratioW
            if (typeof(opts.grid.y) === 'object') {
                opts.grid.y.space *= this.cellSizeByboardToCanvasRatio.h;
                if (opts.grid.y.style) opts.grid.y.style = _fixStyle({...opts.grid.y.style});
            } else opts.grid.y *= this.cellSizeByboardToCanvasRatio.h
        }
    }

    
    // fix the shape and given opts to renderable item after flip and mirror;
    getRenderOpts(shape = {}, reqOpts = {}, parent = null) {
        let opts = this.constructor.parseRenderOpts(shape, reqOpts, parent);

        if (opts.children?.length) opts.children = opts.children.map(childOpt => this.getRenderOpts(undefined, childOpt, {...opts}));
        
        this.fixRenderOptsStyle(opts);
        
        opts = this.flipItem(opts);
        opts = {
            ...opts,
            geoShape: opts.geoShape?.map(pos => this.convertBoardSizeToCanvasSize(pos)),
            ...this.getDrawOpts({
                w: opts.w || 0,
                h: opts.h || 0,
                x: opts.x || 0,
                y: opts.y || 0,
            })
        }
        if (opts.geoShape && opts.style.gradientBgc?.autoCalcGeoShapeSize ) {
            opts.style.gradientBgc.gradientSize = MathService.getPolygonSize(opts.geoShape);
        }
        
        if (opts.grid) {
            opts.children.push(
                ...this.constructor.getGridLines({
                    x: opts.x,
                    y: opts.y,
                    rotate: opts.rotate,
                    // x: 0,
                    // y: 0,
                    w: opts.w,
                    h: opts.h
                }, opts.grid)
            );
        };
        
        return opts;
    }

    // renderShpe: converts the shape data to render format and sends it to doRenderData method;
    renderShape(opts) {
        if (opts.hide) return;
        if (opts.img && !(opts.img instanceof Image)) {
            const imgMap = this.constructor.imgSrcMap;
            if (imgMap[opts.img]) {
                opts.img = imgMap[opts.img];
            }
            else {
                this.loadImage(opts.img).then(elImage => {
                    imgMap[opts.img] = elImage;
                    // this.doRenderData(opts, elImage);
                    this.render();
                });
                return;
            }
        }
        this.doRenderData(opts);
    }

    // this function loads an image by creating image native element, or by a loadImageCb. the cb is needed for NodeJs canvas usage;
    loadImage(src) {
        if (this.canvasOpts.loadImgCb) return this.loadImgCb(src);
        return new Promise((resolve, reject) => {
            const elImage = new Image();
            elImage.src = src;
            elImage.onload = () => resolve(elImage);
        });
    }
    
    // doRenderData: gets render opts and renders it to the canvas;
    doRenderData(opts) {
        const { context } = this;

        let renderW = (opts.strictW || opts.w);
        let renderH = (opts.strictH || opts.h);
        let renderX = -(renderW / 2);
        let renderY = -(renderH / 2);

        context.save();
        if (opts.strictX || opts.strictY) context.translate(opts.strictX || opts.x || 0, opts.strictY || opts.y || 0);
        else if (opts.isCenterPos) context.translate(opts.x || 0, opts.y || 0);
        else context.translate(opts.centerX, opts.centerY);
        if (opts.rotate || opts.strictR) context.rotate((typeof opts.strictR === 'number'? opts.strictR : opts.rotate) * Math.PI / 180);
        if (opts.strictScale && !opts.dontScale) context.scale(opts.strictScale[0], opts.strictScale[1]);
        else if (opts.scale && !opts.dontScale) context.scale(opts.scale[0], opts.scale[1]);
        
        if (opts.img) {
            context.drawImage(opts.img, renderX, renderY, renderW, renderH);
        } else {
            const { style } = opts;
            context.beginPath();
            
            if (style.gradientBgc) {
                const gradientSize = style.gradientBgc.gradientSize || { w: renderW, h: renderH };
                const angle = (style.gradientBgc.angle || 0)/180*Math.PI;
                const gradientBgc = context.createLinearGradient(0, 0, gradientSize.w*Math.cos(angle), (gradientSize.h)*Math.sin(angle));
                style.gradientBgc.colors.forEach(clr => gradientBgc.addColorStop(clr.offset, clr.val));
                context.fillStyle = gradientBgc;
            } 
            else if (style.fillStyle) context.fillStyle = style.fillStyle;
            if (style.strokeStyle) context.strokeStyle = style.strokeStyle;
            if (style.strictLineWidth) context.lineWidth = style.strictLineWidth;
            else if (style.lineWidth) context.lineWidth = style.lineWidth;
            if (style.strictLinePattern) context.setLineDash(style.strictLinePattern);
            else if (style.linePattern) context.setLineDash(style.linePattern);
            if (style.lineCap) context.lineCap = style.lineCap;

            if (style.shadowBlur) context.shadowBlur = style.shadowBlur;
            if (style.shadowColor) context.shadowColor = style.shadowColor;
            if (style.shadowOffsetX) context.shadowOffsetX = style.shadowOffsetX;
            if (style.shadowOffsetY) context.shadowOffsetY = style.shadowOffsetY;

            if (opts.geoShape) {
                opts.geoShape.forEach((pos, idx) => {
                    idx ? 
                        context.lineTo(pos.x, pos.y): 
                        context.moveTo(pos.x, pos.y);
                });
            } else if (opts.circleDegries) {
                const circleDegries = opts.circleDegries;
                const startAngle = MathService.degToRadian(circleDegries[0] || 0);
                const endAngle = MathService.degToRadian(circleDegries[1] || 360);
                // const centerPos = isNested? { x: opts.x || 0, y: opts.y || 0 } : { x: 0, y: 0 };
                // const centerPos = { x: opts.x || 0, y: opts.y || 0 };
                const centerPos = { x: 0, y: 0 };
                if (opts.closeCircle) context.lineTo(centerPos.x, centerPos.y);
                context.ellipse(centerPos.x, centerPos.y, renderW/2, renderH/2, 0, startAngle, endAngle, style.circleCounterClockWise);
                // if (opts.closeCircle) context.lineTo(centerPos.x, centerPos.y);
            } else if (opts.text) {
                // if (context.font) context.font = renderW + 'px ' + style.font || 'Ariel';
                context.font = style.fontWeight || 'normal' + renderW + 'px ' + style.font || 'Ariel';
                if (style.textAlign) context.textAlign = style.textAlign;
                if (style.textBaseline) context.textBaseline = style.textBaseline;
                if (style.fillStyle || style.gradientBgc) context.fillText(opts.text, 0, 0);
                if (style.strokeStyle) context.strokeText(opts.text, 0, 0);
            } else {
                if (style.fillStyle || style.gradientBgc) context.fillRect(renderX, renderY, renderW, renderH);
                if (style.strokeStyle) context.rect(renderX, renderY, renderW, renderH);
            }

            if (style.clear) {
                context.clip();
                // context.translate(-renderW, -renderH); // (0, 0);
                // context.translate(-renderX, -renderY); // (0, 0);
                context.setTransform(1, 0, 0, 1, 0, 0);
                // context.translate(0, 0);
                // context.rotate(0);
                // context.scale(1, 1);
                context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
            } else {
                if (style.fillStyle || style.gradientBgc || style.shadowColor) context.fill();
                if (style.strokeStyle) context.stroke();
            }

            context.closePath();
        }
        context.restore();

        if (opts.children?.length) opts.children.forEach(childOpt => this.renderShape(childOpt));
    }
    
    // renderCell: gets a board cell and sends it to renderShape with render opts recieved from getCellContectCb;
    renderCell(cell, pos = { y: cell.i || cell.y, x: cell.j || cell.x }) {
        const opts = this.getDynamicRenderOpts(cell, pos);
        opts.forEach(opt => this.renderShape(opt));
    }

    // gets the shape renderOpts using the getCellContectCb
    getDynamicRenderOpts(cell, pos = { y: cell.i || cell.y, x: cell.j || cell.x }) {
        if (cell.hide) return [];
        const drawOpts = this.getDrawOpts({...this.flipItem({ x: pos.x, y: pos.y, w: cell.w, h: cell.h })});
        let opts = (this.getCellContectCb) ? this.getCellContectCb(cell, drawOpts, this.context, this) : {};
        if (!opts) opts = [];
        else if (!Array.isArray(opts)) opts = [opts];
        return opts.map(curr => this.getRenderOpts(cell, curr));
    }

    getBgAutoStaticShapes() {
        const baseOpts = { x: 0, y: 0, ...this.boardSize }
        const initShapes = [];
        if (this.canvasOpts.bgc) {
            initShapes.push({
                ...baseOpts,
                style: { fillStyle: this.canvasOpts.bgc },
            });
        }
        if (this.canvasOpts.grid) {
            initShapes.push({
                ...baseOpts,
                grid: this.canvasOpts.grid
            });
        }
        return initShapes;
    }

    resetMapedStaticShapesToRender() {
        this.mapedStaticShapesToRender = null;
    }
    getStaticShapesToRender() {
        if (this.mapedStaticShapesToRender) return this.mapedStaticShapesToRender;
        this.mapedStaticShapesToRender = [...this.getBgAutoStaticShapes(), ...this.board.staticShapes].map(c => this.getRenderOpts(c));
        return this.mapedStaticShapesToRender;
    }

    // render: renders all the data and static shapes in the board using renderShape and renderCell methods
    render() {
        const { context } = this;
        context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
        const { board } = this;
        // this.getBgAutoStaticShapes().forEach(c => this.renderShape(this.getRenderOpts(c)));
        if (!this.isMatrixBoard) {
            const dataToRender = [];
            dataToRender.push(...this.getStaticShapesToRender());
            // if (board.staticShapes) dataToRender.push(...board.staticShapes.map(curr => this.getRenderOpts(curr)));
            if (board.shapes && this.isRenderData) dataToRender.push(...board.shapes.reduce((acc, curr) => [...acc, ...this.getDynamicRenderOpts(curr)], []));
            dataToRender.sort((a, b) => a.zIndex - b.zIndex);
            dataToRender.forEach(curr => this.renderShape(curr));
        }
        else if (this.isRenderData) {
            this.getBgAutoStaticShapes().forEach(c => this.renderShape(this.getRenderOpts(c)));
            // this.mapedStaticShapesToRender.forEach(curr => this.renderShape(curr));
            board.forEach((arr, y) => arr.forEach((cell, x) => this.renderCell(cell, { y, x })));
        }
    
        if (this.listeners.render) this.listeners.render();
        
    }

    lastRenderData = null; // { timeout, at, render };
    debounceRender(force = false) {
        if (this.lastRenderData && !force) {
            this.lastRenderData.render = true;
            return;
        }
        this.render();
        this.lastRenderData = {
            render: false,
            at: new Date(),
            timeout: setTimeout(() => {
                const toRender = this.lastRenderData?.render;
                this.lastRenderData = null;
                if (toRender) this.debounceRender();
            }, 10)
        }
    }


    // board update methods
    
    
    // board setter - to make sure the board has all the relevant data;
    set board(board) {
        if (!board) board = { width: 10000, height: 10000 };
        this._board = {...board};
        const { _board } = this;
        if (!this.isMatrixBoard) {
            if (!_board.staticShapes) _board.staticShapes = [];
            if (!_board.shapes) _board.shapes = [];
            if (!_board.width) _board.width = 1;
            if (!_board.height) _board.height = 1;
        }
    }
    get board() {
        return this._board;
    }

    // doUpdateCell: replace a givven item with the old one on the board;
    doUpdateCell(pos, cell, findIndexCb) {
        const { isMatrixBoard, board } = this;
        if (!isMatrixBoard) {
            const idx = findIndexCb? board.shapes.findIndex(findIndexCb) : -1;
            const oldCell = board.shapes[idx];
            if (idx !== -1) {
                if (this.canvasOpts.enableAnimation && !(cell.hide || oldCell.hide)) return this.doAnimationCellUpdate(cell, findIndexCb);
                board.shapes.splice(idx, 1, { ...oldCell, ...cell });
            }
            else board.shapes.push(cell);
        }
        else {
            const oldCell = board[pos.y][pos.x];
            board[pos.y][pos.x] = {  ...oldCell, ...cell };
        }
    }
    
    // updateCell: get pos and cell and sends it to doUpdateCell, then render;
    updateCell(pos, cell, findIndexCb = (currCell) => currCell.id === cell.id) {
        this.doUpdateCell(pos, cell, findIndexCb);
        this.debounceRender();
        // this.renderCell(cell, pos, this.context);
    }
    
    // updateCell: get poss and cells and sends them to doUpdateCell, then render;
    updateCells(data = [], findIndexCb = (idx) => (cell) => cell.id === data[idx].id) {
        data.forEach((cell, idx) => this.doUpdateCell({ y: cell.i || cell.y, x: cell.j || cell.x }, cell, findIndexCb && findIndexCb(idx)));
        this.debounceRender();
    }

    removeCell(findIdxCbOrItem = (currCell) => currCell.id === cell.id) {
        let idx;
        if (typeof findIdxCbOrItem === 'function') idx = this.board.shapes.findIndex(findIdxCbOrItem);
        else idx = this.board.shapes.findIndex(c => c === findIdxCbOrItem);
        if (idx === -1) return;
        this.board.shapes.splice(idx, 1);
        this.debounceRender();
    }

    removeCells(findIdxCbOrItems = (currCell) => currCell.id === cell.id) {
        const oldItems = [];
        const filteredItems = this.board.shapes.filter((c, idx) => {
            if (typeof findIdxCbOrItems === 'function' && findIdxCbOrItems(c) ||
                Array.isArray(findIdxCbOrItems) && findIdxCbOrItems.includes(c)) {
                    oldItems.push(c);
                    return false;
            } 
            return true;
        } , []);
        this.board.shapes = filteredItems;
        this.debounceRender();
        return oldItems;
    }
    
    // updateBoard: gets a new board, then renders it
    updateBoard(board) {
        this.board = board;
        this.init();
    }

    
    // to update the cells with animation to create a smoother change;
    reqAnimations = {};
    nextAnimateId = 0;
    doAnimationCellUpdate(cell, findIndexCb) {
        const { board } = this;
        const idx = board.shapes.findIndex(findIndexCb);
        const oldCell = board.shapes[idx]
        const targetCell = { ...oldCell, ...cell };
        const posDiffs  = {
            x: targetCell.x - oldCell.x,
            y: targetCell.y - oldCell.y,
            w: targetCell.w - oldCell.w,
            h: targetCell.h - oldCell.h,
            rotate: (targetCell.rotate - oldCell.rotate) || 0
        }
        const reqAnimations = this.reqAnimations;
        const animateKey = cell.id;
        if (!reqAnimations[animateKey]) reqAnimations[animateKey] = {};
        const animateId = this.nextAnimateId++;
        reqAnimations[animateKey].id = animateId;
        const steps = [10,20,35,50,65,80,90,100];
        // const steps = '0'.repeat(Math.abs(parseInt(posDiffs.x))).split('').map((_, idx) => idx+1);
        // const steps = '0'.repeat(20).split('').map((_, idx) => idx+5);
        let count = 0;
        const _doUdate = () => {
            if (reqAnimations[animateKey]?.id !== animateId) return;
            const currStep = steps[count]/100;
            if (!currStep) return;
            const currCell = { ...targetCell };
            Object.keys(posDiffs).forEach(key => {
                const newVal = oldCell[key] + posDiffs[key]*currStep;
                if (typeof newVal !== 'number') newVal = targetCell[key];
                currCell[key] = newVal;
            });
            const idx = board.shapes.findIndex(findIndexCb);
            board.shapes.splice(idx, 1, currCell);
            this.debounceRender();
            if ((count <= steps.length) && (reqAnimations[animateKey]?.id === animateId)) {
                requestAnimationFrame(_doUdate);
                count++;
            } else delete reqAnimations[animateKey];
        }
        requestAnimationFrame(_doUdate);
        {
        //     // if (!this.animationIntervals) this.animationIntervals = {};
        //     const intervals = this.intervals;
        //     const intervalKey = 'cell_animation_' + cell.code;
        //     if (intervals[intervalKey]) clearInterval(intervals[intervalKey]);
        //     const steps = [10,20,35,50,65,80,90,100];
        //     // const steps = '0'.repeat(Math.abs(parseInt(posDiffs.x))).split('').map((_, idx) => idx+1);
        //     let count = 0;
        //     const _doUdate = () => {
        //         const currStep = steps[count]/100;
        //         if (!currStep) return;
        //          const currCell = { ...targetCell };
        //         Object.keys(posDiffs).forEach(key => {
        //             const newVal = oldCell[key] + posDiffs[key]*currStep;
        //             if (typeof newVal !== 'number') newVal = targetCell[key];
        //             currCell[key] = newVal;
        //         });
        //         const idx = board.shapes.findIndex(findIndexCb);
        //         board.shapes.splice(idx, 1, currCell);
        //         this.render();
        //         if (count >= steps.length) clearInterval(intervals[intervalKey]);
        //         else count++;
        //     }
        //     intervals[intervalKey] = setInterval(_doUdate, 50/steps.length);
        }
    }
    

    // To create grid lines in a given position; STILL IN DEVELOPMENT;
    static getGridLines = (() => {
        const getLines = (sizeAndPos = { w, h, x, y }, gridOpts = {}, mainAxis = 'x') => {
            const defStyle = { strokeStyle: 'black' };
            const isNumeric = typeof gridOpts[mainAxis] === 'number';
            const opts = {
                space: (isNumeric? gridOpts[mainAxis] : gridOpts[mainAxis]?.space) || gridOpts.space,
                strictSpace: (isNumeric? gridOpts[mainAxis] : gridOpts[mainAxis]?.strictSpace) || gridOpts.strictSpace,
                align: (isNumeric? gridOpts.align : (gridOpts[mainAxis]?.align || gridOpts.align)) || 'start',
                style: (isNumeric? gridOpts.style : (gridOpts[mainAxis]?.style || gridOpts.style)) || defStyle,
                rotate: (isNumeric? gridOpts.rotate : (gridOpts[mainAxis]?.rotate || gridOpts.rotate)) || 0
            }
    
            const space = opts.strictSpace || opts.space;
    
            const secAxis = mainAxis === 'x'? 'y' : 'x';
            const mainSizeKey = mainAxis === 'x'? 'w' : 'h';
            const secSizeKey = mainSizeKey === 'w'? 'h' : 'w';
            
            const mainSize = sizeAndPos[mainSizeKey];
            const secSize = sizeAndPos[secSizeKey];
            
            let startM = sizeAndPos[mainAxis];
            let startS = sizeAndPos[secAxis];
            let endM = startM + mainSize;
            let endS = startS + secSize;
    
            // let direction = 1;
            // if (mainAxis === 'y' && opts.rotate) {
                //     // opts.rotate += 180;
            //     // [startS, endS] = [endS, startS];
            //     // [startM, endM] = [endM, startM];
            //     // direction = -1;
            // }
            let start = startM;
            let lineCount = Math.ceil(mainSize / space);
            if (opts.align) {
                const restSpace = mainSize % space;
                if (opts.align === 'center') start += restSpace/2;
                else if (opts.align === 'end') start += restSpace;
                // else if (opts.align === 'start') start += 0;
            }
            if (opts.rotate) {
                const firstEndPos = MathService.getFullPosByPosAndDeg({ [mainAxis]: startM, [secAxis]: startS }, { [mainAxis]: null, [secAxis]: endS }, opts.rotate);
                const diff = startM - firstEndPos[mainAxis];
                if (opts.rotate > 0) {
                    start += diff;
                }
                lineCount += Math.ceil(Math.abs(diff / space));
                // const lastEndPos = MathService.getFullPosByPosAndDeg({ [mainAxis]: endM, [secAxis]: startS }, { [mainAxis]: null, [secAxis]: endS }, opts.rotate);
                // start+=(endM - lastEndPos[mainAxis]);
                
            }
            // const lineCount = Math.ceil(mainSize-start / space);
            // const lineCount = 1;
            const res = [];
            for (let i = 0; i <= lineCount; i++) {
                const main = start + space*i;
                if (main > endM && (opts.rotate > 0 || !opts.rotate)) break;
                if (main < startM && (opts.rotate < 0 || !opts.rotate)) break;
    
                let startPos = { [mainAxis]: main, [secAxis]: startS };
                let endPos = { [mainAxis]: main, [secAxis]: endS };
                if (opts.rotate) {
                    endPos = MathService.getFullPosByPosAndDeg(startPos, { [mainAxis]: null, [secAxis]: endS }, opts.rotate);
                    if (endPos[mainAxis] > endM) endPos = MathService.getFullPosByPosAndDeg(startPos, { [mainAxis]: endM, [secAxis]: null }, opts.rotate);
                    else if (endPos[mainAxis] < startM) endPos = MathService.getFullPosByPosAndDeg(startPos, { [mainAxis]: startM, [secAxis]: null }, opts.rotate);
                    
                    if (startPos[mainAxis] < startM) startPos = MathService.getFullPosByPosAndDeg(endPos, {[mainAxis]: startM, [secAxis]: null}, opts.rotate);
                    else if (startPos[mainAxis] > endM) startPos = MathService.getFullPosByPosAndDeg(endPos, {[mainAxis]: endM, [secAxis]: null}, opts.rotate);
                }
                let line = {
                    geoShape: [
                        startPos,
                        endPos,
                    ],
                    style: opts.style
                };
                if (sizeAndPos.rotate) {
                    const centerPos = {
                        x: sizeAndPos.x + sizeAndPos.w/2,
                        y: sizeAndPos.y + sizeAndPos.h/2,
                    }
                    line.geoShape = line.geoShape.map(c => MathService.rotatePosition(c, sizeAndPos.rotate, centerPos));
                }
                res.push(line);
            }
            return res;
        }
        return (sizeAndPos = { w:1, h:1, x:0, y:0 }, gridOpts = {}) => {
            const res = [];
            if (gridOpts.x || gridOpts.space || gridOpts.strictSpace) res.push(...getLines(sizeAndPos, gridOpts, 'x'));
            if (gridOpts.y || gridOpts.space || gridOpts.strictSpace) res.push(...getLines(sizeAndPos, gridOpts, 'y'));
            return res;
        }
    })();


    
    // ratio methods
    
    // gets the shape position on the canvas, after calcing with the board to canvas ratio
    getPosOpts(pos = { x: 0, y: 0 }) {
        const { w: cellW, h: cellH } = this.cellSizeByboardToCanvasRatio;
        let { x, y } = this.convertBoardSizeToCanvasSize(pos);
    
        x -= this.canvasRootRenderPos.x;
        y -= this.canvasRootRenderPos.y;
    
        return { x: x, y: y, actualX: x - cellW / 2, actualY: y - cellH / 2 };
    }

    // converts any size/pos property from board ratio to canvas ratio, or canvas to board;
    convertBoardSizeToCanvasSize(size = { w: 1, h: 1, x: 0, y: 0 }, isFromCanvasPos = false) {
        const { w: ratio } = this.cellSizeByboardToCanvasRatio;
        const res = {};
        for (let key in size) {
            res[key] = !isFromCanvasPos? size[key] * ratio : size[key] / ratio;
        }
        return res;
    }
    
    // gets all shape's pos and size relevant opts for render
    getDrawOpts(opts = { x: 0, y: 0, w: 1, h: 1 }) {
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
    
    // gets offset position on the board for the canvas event
    getBoardPosFromCanvasDomEvent(ev) {
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
    
    // gets offset position from event;
    static getOffsetPosFomDomEvent(ev, isClientPos) {
        if (isClientPos && ev.clientX) return { x: ev.clientX, y: ev.clientY };
        return (typeof ev.offsetX === 'number')
            ? { x: ev.offsetX, y: ev.offsetY }
            : {
                x: ev.touches[0].clientX - ev.touches[0].target.offsetLeft,
                y: ev.touches[0].clientY - ev.touches[0].target.offsetTop
            };
    }
    
    // calcs the size of the canvas in the board'w aspect ratio;
    calcCanvasSize() {
        const { boardSize, elParent } = this;
        const elementSize = {
            w: elParent.offsetWidth,
            h: elParent.offsetHeight
        }
        const renderSize = MathService.fitParentSize(elementSize, boardSize);
        // if (this.isSizeFlipped) renderSize.w = renderSize.h*(renderSize.h/renderSize.w);
        // if (this.isSizeFlipped) [renderSize.w, renderSize.h] = [renderSize.h, renderSize.w];
        return renderSize;
    }


    
    // zoom methods
    
    // sets all the window and canvas zoom methods;
    setZoomDomEvMethods() {
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
    
    // update the root render pos after zoom;
    updateRootRenderPos(diffs = { x: 0, y: 0 }, isStrictPos = false) {
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
    // validates that the canvas render by the root render pos is not out of the board lines. if so, it fixes it;
    validateRootRenderPos() {
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

    // updates the zoom level and the root render pos - according to the new zoom level;
    updateZoomLevel(diff = 0, canvasPos) {
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
    
    // sets the scroll sizes according to rendered canvas pos;
    setScrollSize() {
        let { scrollSizes, canvasRootRenderPos, renderedCanvasSize, canvasSize } = this;
        if (!scrollSizes) this.scrollSizes = scrollSizes = { vertical: { pad: 0, size: 0 }, horizontal: { pad: 0, size: 0 } };
        scrollSizes.vertical.pad = (canvasRootRenderPos.y / renderedCanvasSize.h) * 100;
        scrollSizes.horizontal.pad = (canvasRootRenderPos.x / renderedCanvasSize.w) * 100;
        scrollSizes.vertical.size = canvasSize.w / renderedCanvasSize.w * 100;
        scrollSizes.horizontal.size = canvasSize.h / renderedCanvasSize.h * 100;
        this.updateElScrollsStyle();
    }


    // Flip methods:

    // This function is used to flip and mirror each shape in the service according to the service flip/mirror properties
    flipItem(item = {}, debug) {
        let { flipLevel: level, isMirrorX, isMirrorY, boardSize, isSizeFlipped } = this;
        const fixAng = ang => ang > 0? ang === 360 && ang || ang%360 : (360+ang)%360;

        if (level === 1 && !isMirrorX && !isMirrorY) return item;

        // if (item.geoShape) item.geoShape = item.geoShape.map(pos => this.flipItem(pos, true));

        // const bySize = isRelative? { w: 0, h: 0 } : boardSize;
        const bySize = boardSize;
        const rotate = item.rotate || 0;
        const x = item.x || 0;
        const y = item.y || 0;
        let w = item.w || 0;
        let h = item.h || 0;
        let scale = item.scale || [1, 1];

        let reducedX = (x + (item.isCenterPos? 0 : w));
        let reducedY = (y + (item.isCenterPos? 0 : h));
        
        const res = { ...item, x, y, w, h, rotate, scale };

        if (isMirrorX) {
            res.x = (bySize.w - reducedX);
            res.rotate = fixAng(-rotate);
            // if (res.circleDegries) {
            //     res.circleDegries = res.circleDegries.map(c => fixAng(c - (res.circleDegries[0] - res.circleDegries[1])));
            // }
            res.scale[0] *= -1;
            
            reducedX = (res.x + (item.isCenterPos? 0 : res.w));
            // reducedY = (res.y + (item.isCenterPos? 0 : res.h));
        }
        if (isMirrorY) {
            res.y = (bySize.h - reducedY);
            res.rotate = fixAng(180+(180-res.rotate));
            // if (res.circleDegries) {
            //     res.circleDegries = res.circleDegries.map(c => fixAng(c - (res.circleDegries[0] - res.circleDegries[1])));
            // }
            res.scale[1] *= -1;

            reducedY = (res.y + (item.isCenterPos? 0 : res.h));
        }
        const centerPos = { x: boardSize.w/2, y: boardSize.h/2 };
        const byPos = { x: reducedX, y: reducedY };

        let fixRotateBy = 0;
        switch (level) {
            case 1:
                return res;
                break; 
            case 3:
                fixRotateBy = 180;
                break;
                // res.y = (bySize.h - reducedY);
                // res.x = (bySize.w - reducedX);
                // if (res.circleDegries) {
                //     res.circleDegries = res.circleDegries.map(c => fixAng((c - (res.circleDegries[0] - res.circleDegries[1])))) ;
                // }
            case 2:
                fixRotateBy = 90;
                break;
                // res.y = x;
                // res.x = bySize.w - reducedY;
                // res.rotate = fixAng(res.rotate - 90);
            case 4:
                fixRotateBy = 270;
                // res.y = bySize.h - reducedX;
                // res.x = reducedY;
                // res.rotate = fixAng(res.rotate - 270);
        }
        // console.log(MathService.rotatePosition({x: 0, y: 0}, 90, centerPos), centerPos)
        return {
            ...res,
            ...MathService.rotatePosition(byPos, fixRotateBy, centerPos),
            rotate: fixAng(res.rotate + fixRotateBy)
        }
    }
    
    // we use 4 flip levels (1 - 4); 1 is the default, 3 is 180 deg flip; 2 and 4 are still in development, both used for vertical flip;
    updateFlipLevel(val = 1, exact = false) {
        if (exact) this.flipLevel = val;
        else this.flipLevel += val;
        this.init();
    }
    set flipLevel(level) {
        if (![1, 2, 3, 4].includes(level)) level = 1;
        this. _flipLevel = level;
    }
    get flipLevel() {
        return this._flipLevel || 1;
    }

    // to toggle mirrorX and mirrorY service properties;
    toggleMirrorX(val) {
        if (typeof val === 'boolean') this.isMirrorX = val;
        else this.isMirrorX = !this.isMirrorX;
        this.init();
    }
    toggleMirrorY(val) {
        if (typeof val === 'boolean') this.isMirrorY = val;
        else this.isMirrorY = !this.isMirrorY;
        this.init();
    }

    // Tells if the board is in vertical flip (flip level 2/4);
    get isSizeFlipped() {
        return [2,4].includes(this.flipLevel);
    }
    
    
    // scroll zoom and flip ui methods
    
    // updates the zoom elements style properties;
    updateElScrollsStyle() {
        const { scrollSizes } = this;
        const elActions = this.elCanvasContainer.querySelector('.actions');
        if (!elActions) return;
        elActions.querySelectorAll('.grab').forEach(elGrab => {
            const isVertical = elGrab.classList.contains('vertical');
            if (isVertical) {
                elGrab.style.height = scrollSizes.vertical.size + '%';
                elGrab.style.top = scrollSizes.vertical.pad + '%'
            } else {
                elGrab.style.width = scrollSizes.horizontal.size + '%';
                elGrab.style.left = scrollSizes.horizontal.pad + '%'
            }
        });
    }
    
    // creates the canvas actions elements (zoom, scroll, flip, mirror), if required;
    getActionsElement() {
        let grabedScroll = '';
        let prevDragedPos = null;

        const { enableZoomUi, enableScrollUi, enableFlipUi, enableMirrorUi } = this.canvasOpts;
        
        const { El } = ElementService;

        const el = El(`<div class="actions"></div>`, {}, [
            El(`<style>${this.constructor.getActionsStyleStr(this.selector)}</style>`),
            enableZoomUi &&
            El(`<div class="zoom-btns control-section"></div>`, {}, [
                El(`<button class="icon plus-btn"></button>`, { onclick: () => this.updateZoomLevel(0.1) }),
                El(`<button class="icon minus-btn"></button>`, { onclick: () => this.updateZoomLevel(-0.1) }),
            ]),
            enableScrollUi &&
            El(`<div class="scrolls"></div>`, {}, [
                El(`<div class="scroll-container horizontal control-section"></div>`, {}, [
                    El(`<button class="icon plus-btn"></button>`, { onclick: () => this.updateRootRenderPos({ y: 0, x: -30 }) }),
                    El(`<div class="scroll"></div>`, {}, [
                        El(`<div class="grab horizontal"></div>`, { onmousedown: () => grabedScroll = 'horizontal' })
                    ]),
                    El(`<button class="icon minus-btn"></button>`, { onclick:  () => this.updateRootRenderPos({ y: 0, x: 30 }) }),
                ]),
                El(`<div class="scroll-container vertical control-section"></div>`, {}, [
                    El(`<button class="icon plus-btn"></button>`, { onclick:  () => this.updateRootRenderPos({ y: -30, x: 0 }) }),
                    El(`<div class="scroll"></div>`, {}, [
                        El(`<div class="grab vertical"></div>`, { onmousedown: () => grabedScroll = 'vertical' })
                    ]),
                    El(`<button class="icon minus-btn"></button>`, { onclick:  () => this.updateRootRenderPos({ y: 30, x: 0 }) }),
                ]),
            ]),
            (enableFlipUi || enableMirrorUi) &&
            El('<div class="flip-btns control-section"></div>', {}, [
                enableFlipUi && El('<button class="icon flip-btn" title="Flip 180"></button>', { onclick: () => this.updateFlipLevel(2) }),
                enableMirrorUi && El('<button class="icon mirror-x-btn" title="Mirror X"></button>', { onclick: () => this.toggleMirrorX() }),
                enableMirrorUi && El('<button class="icon mirror-y-btn" title="Mirror Y"></button>', { onclick: () => this.toggleMirrorY() }),
            ])
        ]);
    
        if (!this.canvasOpts.enableScrollUi) return el;
    
        ['mousemove', 'touchmove'].forEach(evName => this.addWindowEventListener(evName, (ev) => {
            // ev.preventDefault();
            if (this.isDragOn) return;
            if (!grabedScroll) return;
            const pos = { x: ev.clientX, y: ev.clientY };
            if (!prevDragedPos) return prevDragedPos = pos;
            const isVertical = grabedScroll === 'vertical';
            const diff = isVertical ? pos.y - prevDragedPos.y : pos.x - prevDragedPos.x;
            this.updateRootRenderPos({
                x: !isVertical ? diff * this.zoomLevel : 0,
                y: isVertical ? diff * this.zoomLevel : 0
            });
            prevDragedPos = pos;
        }));
        ['mouseup'].forEach(evName => this.addWindowEventListener(evName, (ev) => {
            // ev.preventDefault();
            if (!prevDragedPos) return;
            prevDragedPos = null;
            grabedScroll = '';
        }));
    
        return el;
    }
    
    // sets the actions alements positions in the canvas after init;
    setElActionPositions() {
        const { element, canvasSize } = this;
        const pad = { // paddingFromCanvas
            w: (element.offsetWidth - canvasSize.w) / 2 || 0,
            h: (element.offsetHeight - canvasSize.h) / 2 || 0
        }
        const elActions = element.querySelector('.actions');
        if (!elActions) return;
        elActions.querySelectorAll('.scroll-container').forEach(el => {
            if (el.classList.contains('horizontal')) {
                el.style.bottom = pad.h + 10 + 'px';
                el.style.width = canvasSize.w*0.7 + 'px';
            }
            else  {
                el.style.right = pad.w + 10 + 'px';
                el.style.height = canvasSize.h*0.7 + 'px';
            }
        });
        if (this.canvasOpts.enableZoomUi) {
            const elZoomBtns = elActions.querySelector('.zoom-btns');
            elZoomBtns.style.bottom = pad.h + 10 + 'px';
            elZoomBtns.style.left = pad.w + 10 + 'px';
        }
        if (this.canvasOpts.enableFlipUi || this.canvasOpts.enableMirrorUi) {
            const elFlipBtns = elActions.querySelector('.flip-btns');
            elFlipBtns.style.top = pad.h + 10 + 'px';
            elFlipBtns.style.left = pad.w + 10 + 'px';
            if (this.canvasOpts.enableMirrorUi) {
                elFlipBtns.querySelector('.mirror-x-btn').classList[this.isMirrorX? 'add' : 'remove']('on');
                elFlipBtns.querySelector('.mirror-y-btn').classList[this.isMirrorY? 'add' : 'remove']('on');
            }
        }
    }
    
    
    // window events methods
    
    // add listeners to window and keeps it;
    addWindowEventListener(evName, cb) {
        if (!this.windowEvsMap[evName]) this.windowEvsMap[evName] = [];
        this.windowEvsMap[evName].push(cb);
        window.addEventListener(evName, cb);
    }
    // removes all the added window listeners, call this method when canvas is destoryed;
    removeWindowEventListeners() {
        const { windowEvsMap } = this;
        for (let evName in windowEvsMap) {
            const cbs = windowEvsMap[evName];
            cbs.forEach(cb => window.removeEventListener(evName, cb));
        }
        this.resizeObserver.unobserve(this.elParent);
        this.resizeObserver.disconnect();
        Object.values(this.intervals).forEach(clearInterval);
    }

    // resizeTimeOut = null;
    // resizeDebounce() {
    //     if (this.resizeTimeOut) return;
    //     this.resizeTimeOut = setTimeout(() => {
    //         this.init();
    //         this.resizeTimeOut = null;
    //     }, 0);
    // }
    
    // canvas resize observable for a case the parent element is being resized; makes it responsive;
    setResizeEvents() {
        // this.elParent.addEventListener('resize', this.resizeDebouncebind(this));
        this.resizeObserver = new ResizeObserver(this.init.bind(this));
        this.resizeObserver.observe(this.elParent);
    }

    static isPosOnItem(pos, item, edgeOnly = false) {
        // if (item.circleDegries) return this.isPosInEllipse(pos, item, rotate, acordingToPos);
        item = this.parseRenderOpts(item);
        let polygon = item.geoShape;
        let acordingToPos = item.x && { x: item.x, y: item.y } || undefined;
        if (item.circleDegries) {
            // { w: item.w, h: item.h, x: item.x, y: item.y, circleDegries: item.circleDegries, rotate: item.rotate };
            if (MathService.isPosInEllipse(pos, item, acordingToPos)) return true;
        }
        else if (!polygon) {
            if (!item.isCenterPos) acordingToPos = item.x && { x: item.x + item.w/2, y: item.y + item.h/2 } || undefined;
            polygon = MathService.rectToPolygon(item, acordingToPos);
        }
        if (polygon && MathService.isPosOnPoligon(pos, polygon, item.rotate, acordingToPos, !edgeOnly, edgeOnly)) return true;
        if (item.children?.some(c => this.isPosOnItem(pos, this.parseRenderOpts(undefined, c, item)))) return true;
        return false;
    }


    static getActionsStyleStr(parentSelector = '') {
        const baseSelector = `${parentSelector} .actions`;
        const { StyleEl } = ElementService;
        const logicStyle = StyleEl(baseSelector, {
            'user-select': 'none',
            '.control-section': {
                'position': 'absolute'
            },
            button: {
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                '&:hover': {
                    cursor: 'pointer'
                }
            },
            '.plus-btn': {
                '&:after': {
                    content: '"+"',
                }
            },
            '.minus-btn': {
                '&:after': {
                    content: '"-"',
                }
            },
            '.zoom-btns': {
                bottom: '10px',
                left: '10px',
                display: 'flex',
                'flex-direction': 'column',
            },
            '.scrolls': {
                '.scroll-container': {
                    display: 'flex',
                    '.scroll': {
                        position: 'relative',
                        flex: 1,
                        display: 'flex',
                        '.grab': {
                            position: 'absolute',
                            height: '100%',
                            '&:hover': {
                                cursor: 'pointer'
                            },
                            '&.horizontal': {
                                width: '100%',
                                left: '0%'
                            },
                            '&.vertical': {
                                width: '100%',
                                top: '0%' 
                            }
                        }
                    },
                    '&.horizontal': {
                        bottom: '10px',
                        right: '50%',
                        transform: 'translateX(50%)',
                        width: '70%'
                    },
                    '&.vertical': {
                        'flex-direction': 'column',
                        right: '10px',
                        bottom: '50%',
                        transform: 'translateY(50%)',
                        height: '70%',
                        '.scroll': {
                            'flex-direction': 'column'
                        }
                    }
                }
            },
            '.flip-btns': {
                top: '10px',
                left: '10px',
                display: 'flex',
                'flex-direction': 'column',
                '.flip-btn': {
                    '&:after': {
                        content: '"⟳"',
                    }
                },
                '.mirror-x-btn': {
                    '&:after': {
                        content: '"↹"',
                    }
                },
                '.mirror-y-btn': {
                    '&:after': {
                        content: '"↹"',
                        transform: 'rotate(90deg)'
                    }
                }
            }
        });
        // return logicStyle;
        const styledStyle = StyleEl(baseSelector, {
            '.control-section': {
                'background-color': 'rgba(255, 255, 255, 0.5)',
                border: '1px solid black',
                padding: '5px',
                'border-radius': '5px',
            },
            button: {
                border: '1px solid black',
                'border-radius': '3px',
                'background-color': 'rgb(116, 116, 116)',
                color: 'white',
                transition: '.2s',
                '&:hover': {
                    'background-color': 'rgb(153, 151, 151)',
                },
                '&.on': {
                    'box-shadow': '0px 0px 20px 0px rgba(254,255,30,0.75)'                
                }
            },
            '.zoom-btns': {
                gap: '10px',
                button: {
                    width: '30px',
                    height: '30px',
                }
            },
            '.scrolls': {
                '.scroll-container': {
                    gap: '7.5px',
                },
                '.grab': {
                    'border-radius': '10px',
                    'background-color': 'rgba(54, 100, 168, 0.9)',
                    '&:hover': {
                        cursor: 'pointer',
                    }
                },
                button: {
                    width: '15px',
                    height: '15px',
                }
            },
            '.flip-btns': {
                gap: '10px',
                button: {
                    width: '25px',
                    height: '25px',
                }
            }
        });
        return logicStyle + styledStyle;
    }

    // static MathService = MathService;
}


const Utils = {
    getElPosOnScreen(el) {
        const pos = { y: 0, x: 0 };
        if (!el) return pos;
        let _el = el;
        while(_el.tagName !== 'BODY') {
            pos.y += _el.offsetTop;
            pos.x += _el.offsetLeft;
            _el = _el.offsetParent;
        }
        return pos;
    },
    copy(item) {
        return JSON.parse(JSON.stringify(item));
    }
}

export const MathService = {
    degToRadian: deg => deg*(Math.PI/180),
    // degToRadian: deg => deg/180*Math.PI, // Math.PI is half circle;
    radianToDeg: radian => Math.atan(radian) * 180 / Math.PI,
    slope: ({x: x1, y: y1}, {x: x2, y: y2}, byY = true) => {
        if ((byY && (x1 === x2)) || (!byY && (y1 === y2))) return null;
        return byY? 
            (y1 - y2) / (x1 - x2) : 
            (x1 - x2) / (y1 - y2) ;
    },
    incline: (pos1, pos2, forEachX = true) => {
        const x1 = pos1.x;
        const y1 = pos1.y;
        const x2 = pos2.x;
        const y2 = pos2.y;

        let slope = slope(pos1, pos2);
        if (y1 === y2) slope = 0;
        else if (x1 === x2) slope = (y1 > y2) ? -1 : 1;

        let y = slope;
        let x = !y ? (1 * x1 > x2 ? -1 : 1) : 0;

        if (x1 !== x2 && y1 !== y2) {
            if (y1 < y2 && y < 0 || y1 > y2 && y > 0) y *= -1;
            x = (x1 > x2) ? -1 : 1;
        }

        if (!forEachX) {
            x *= -1;
            y *= -1;
            if (y > 1) {
                x /= y;
                y = 1;
            }
        }

        return { x, y };
    },
    getPolygonSize(polygon = []) {
        const sizeReducer = (key, isMin) => {
            return (acc, pos) => {
                const val = pos[key];
                if (acc === null) return val;
                if ((isMin && val < acc) ||
                    (!isMin && val > acc)) return val;
                return acc;
            }
        }
        // const maxY = geoShape.reduce((acc, c) => acc !== null? acc < c.y && c.y || acc : c.y, null);
        const maxY = polygon.reduce(sizeReducer('y', false), null);
        const maxX = polygon.reduce(sizeReducer('x', false), null);
        const minY = polygon.reduce(sizeReducer('y', true ), null);
        const minX = polygon.reduce(sizeReducer('x', true ), null);
        return {
            maxX,
            maxY,
            minX,
            minY,
            w: Math.abs(minX) + Math.abs(maxX),
            h: Math.abs(minY) + Math.abs(maxY)
        };
    },
    posOnYAxis (pos1, pos2) {
        if (pos1.x === pos2.x) {
            if (pos1.x !== 0) return null;
            return 0;
        }
        const m = this.slope(pos1, pos2);
        const x = pos1.y - m * pos1.x;
        return x;
        // return { y: 0, x };
    },
    getIntersectPos(line1, line2) { // line === [{x: 0, y: 0}, {x: 0, y: 0}]
        line1.sort(sortLine);
        line2.sort(sortLine);
        // if (JSON.stringify(line1[0]) === JSON.stringify(line2[0])) return line1[0]; 
        // if (JSON.stringify(line1[1]) === JSON.stringify(line2[1])) return line1[1]; 
        
        const posOnYAx1 = this.posOnYAxis(...line1);
        const posOnYAx2 = this.posOnYAxis(...line2);
        
        // if ([posOnYAx1, posOnYAx2].includes(null)) return null;
        // if (posOnYAx1 === posOnYAx2) return { x: 0, y: posOnYAx1 };
        if (posOnYAx1 === posOnYAx2) {
            if ([posOnYAx1, posOnYAx2].includes(null)) return null;
            return { x: 0, y: posOnYAx1 };
            // return null;
        }
        
        const slope1 = this.slope(...line1);
        const slope2 = this.slope(...line2);
        if (slope1 === slope2) return null;

        // if ([slope1, slope2].includes(null)) return null;
        if (slope1 === null) return { y: line2[0].y, x: slope2*line2[0].y + posOnYAx2 };
        if (slope2 === null) return { y: line1[0].y, x: slope1*line1[0].y + posOnYAx1 };

        const x = (slope1 * line1[0].x + posOnYAx1 - posOnYAx2) / slope2;
        const y = slope1 * x + posOnYAx1;

        return { x, y };
    },
    isIntersect(line1, line2) {   // from web, try to rewrite
        const l1x1 = line1[0].x;  // a
        const l1y1 = line1[0].y;  // b
        const l1x2 = line1[1].x;  // c
        const l1y2 = line1[1].y;  // d
        const l2x1 = line2[0].x;  // p
        const l2y1 = line2[0].y;  // q
        const l2x2 = line2[1].x;  // r
        const l2y2 = line2[1].y;  // s
        const det = (l1x2 - l1x1) * (l2y2 - l2y1) - (l2x2 - l2x1) * (l1y2 - l1y1);
        if (det === 0) return false;
        const lambda = ((l2y2 - l2y1) * (l2x2 - l1x1) + (l2x1 - l2x2) * (l2y2 - l1y1)) / det;
        const gamma = ((l1y1 - l1y2) * (l2x2 - l1x1) + (l1x2 - l1x1) * (l2y2 - l1y1)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    },
    pythagoras(w, h) {
        return Math.sqrt(w**2 + h**2);
    },
    distBetweenPoss(a, b) {
        const w = Math.abs(a.x - b.x);
        const h = Math.abs(a.y - b.y);
        return this.pythagoras(w, h);
    },
    isPosOnLine(pos, line) {
        const dist = this.distBetweenPoss.bind(this);
        const [a, b] = line;
        return dist(pos, a) + dist(pos, b) === dist(a, b);
    },
    isPosOnPoligon(pos = {x: 0, y: 0}, polygon = [], rotate = 0, acordingToPos, autoCloseShape = true, edgeOnly = false) {
        const sortLine = (a,b) => a.x-b.x;
        if (rotate) polygon = polygon.map(c => this.rotatePosition(c, rotate));
        if (acordingToPos) polygon = polygon.map(c => ({ x: c.x+acordingToPos.x, y: c.y+acordingToPos.y }));
        const { maxX, maxY, minX, minY } = this.getPolygonSize(polygon);
        if (pos.x < minX || pos.x > maxX || pos.y < minY || pos.y > maxY) return false;
        const testLine = [pos, { x: maxX+1, y: pos.y }].sort(sortLine);
        let intersectPossCount = 0;
        for (let i = 0; i < polygon.length; i++) {
            if (!autoCloseShape && !polygon[i+1]) break;
            const currPolLine = [polygon[i], polygon[i+1] || polygon[0]].sort(sortLine);
            if (edgeOnly) {
                if (this.isPosOnLine(pos, currPolLine)) return true;
                continue;
            }
            if (JSON.stringify(currPolLine[0]) === JSON.stringify(currPolLine[1])) continue;
            const intersectPos = this.isIntersect(testLine, currPolLine);
            if (intersectPos) intersectPossCount++;
        }
        if (edgeOnly) return false;
        return (intersectPossCount % 2 === 0)? false : true; 
    },
    rotatePosition(pos = { x: 0, y: 0 }, deg = 0, acordingToPos = { x: 0, y: 0 }) {
        const x = pos.x - acordingToPos.x;
        const y = pos.y - acordingToPos.y;
        const rad = this.degToRadian(deg);
        return {
            y: (x*Math.sin(rad) + y*Math.cos(rad)) + acordingToPos.y,
            x: (x*Math.cos(rad) - y*Math.sin(rad)) + acordingToPos.x
        }
    },
    posByPosDegAndDist(pos, deg, dist) {
        // deg += 90;
        return {
            x: pos.x + (dist * Math.cos(this.degToRadian(deg))),
            y: pos.y + (dist * Math.sin(this.degToRadian(deg)))
        }
    },
    isPosInEllipse(pos = { x: 0, y: 0 }, ellipse = { w: 0, y: 0, x: 0, h: 0, rotate: 0, circleDegries: [] }, acordingToPos) {
        pos = this.rotatePosition(pos, -ellipse.rotate || 0, ellipse);
        // TODO;
        /**
         */
        const testRects = [];
        const circleDegs = ellipse.circleDegries;
        const rectsCount = Math.ceil(Math.abs(circleDegs[1] - circleDegs[0]) / 90);
        for (let i = 0; i < rectsCount; i++) {
            const startDeg = circleDegs[0] + 90*i;
            let endDeg = startDeg + 90;
            if (endDeg > circleDegs[1]) {
                endDeg = circleDegs[1];
            }
            const biggerSize = Math.max(ellipse.w, ellipse.h)/2;
            const ellipsePos = { x: ellipse.x, y: ellipse.y };
            const secPos = this.posByPosDegAndDist(ellipsePos, startDeg, biggerSize);
            const testRect = [
                ellipsePos,
                secPos,
                this.posByPosDegAndDist(secPos, endDeg, biggerSize),
                this.posByPosDegAndDist(ellipsePos, endDeg, biggerSize),
            ];
            testRects.push(testRect);
            if (endDeg >= circleDegs[1]) break;
        }
        const isIntesectRect =  testRects.some(c => this.isPosOnPoligon(pos, c, undefined));
        const rX = ellipse.w/2;
        const rY = ellipse.h/2;
        const isIntersectEllipse = (((pos.x-ellipse.x)**2)/(rX**2)) + (((pos.y-ellipse.y)**2)/(rY**2)) <= 1;
        return isIntesectRect && isIntersectEllipse;
    },
    rectToPolygon(rect, acordingToPos = { x: 0, y: 0 }, debug) {
        const { w, h, x, y, isCenterPos } = rect;
        let xStart = x - acordingToPos.x;
        let xEnd = x+w - acordingToPos.x;
        let yStart = y - acordingToPos.y;
        let yEnd = y+h - acordingToPos.y;
        if (isCenterPos) {
            xStart -= (w/2);
            xEnd -= (w/2);
            yStart -= (h/2);
            yEnd -= (h/2);
        }
        return [
            { x: xStart, y: yStart },
            { x: xEnd, y: yStart },
            { x: xEnd, y: yEnd },
            { x: xStart, y: yEnd },
        ];
    },
    // isPosInRect(pos, rect) {
    //     const { w, h, x, y, isCenterPos } = rect;
    //     let xStart = x
    //     let xEnd = x+w;
    //     let yStart = y
    //     let yEnd = y+h;
    //     if (isCenterPos) {
    //         xStart -= w/2;
    //         xEnd -= w/2;
    //         yStart -= h/2;
    //         yEnd -= h/2;
    //     }
    //     return pos.x >= xStart && pox.x <= xEnd &&
    //            pos.y >= yStart && pos.y <= yEnd;
    // },
    fitParentSize(containerSize, elementSize) {
        const biggerElementSizeProp = elementSize.w > elementSize.h ? 'w' : 'h';
        const smallerElementSizeProp = biggerElementSizeProp === 'w' ? 'h' : 'w';
        const elementRatio = elementSize[smallerElementSizeProp] / elementSize[biggerElementSizeProp];

        const isContainerWide = elementSize.w > elementSize.h;
        const isElementRatioSmallerThanContainer = elementSize.w / elementSize.h < containerSize.w / containerSize.h;
        
        let convertedSize;
        if (containerSize.w > containerSize.h) {
            if (isElementRatioSmallerThanContainer) convertedSize = {
                h: containerSize.h,
                w: (isContainerWide) ? containerSize.h / elementRatio : containerSize.h * elementRatio
            }
            else convertedSize = {
                w: containerSize.w,
                h: (isContainerWide) ? containerSize.w * elementRatio : containerSize.w / elementRatio
            }
        } else {
            if (isElementRatioSmallerThanContainer) convertedSize = {
                h: containerSize.h,
                w: (isContainerWide) ? containerSize.h / elementRatio : containerSize.h * elementRatio
            }
            else convertedSize = {
                w: containerSize.w,
                h: (isContainerWide) ? containerSize.w * elementRatio : containerSize.w / elementRatio
            }
        }
        return convertedSize;
    },
    getFullPosByPosAndDeg(pos = { x: 0, y: 0 }, posToFill = { x: 0,y: 0 }, deg = 360) {
        const rad = this.degToRadian(deg);
        // const rad = deg;
        const axis = posToFill.x === null ? 'x' : 'y';
        if (axis === 'x') {
            // (pos.y-posToFill.y) / (pos.x-posToFill.x) = rad;
            // (pos.y-posToFill.y) = rad * (pos.x-posToFill.x);
            // (pos.y-posToFill.y) / rad = (pos.x-posToFill.x);
            // ((pos.y-posToFill.y) / rad) - pos.x = (-posToFill.x);
            // -(((pos.y-posToFill.y) / rad) - pos.x) = posToFill.x;
            // return -(((pos.y-posToFill.y) / rad) - pos.x);
            posToFill.x = -(((pos.y-posToFill.y) / rad) - pos.x);
        } else if (axis === 'y') {
            // (pos.y-posToFill.y) / (pos.x-posToFill.x) = rad;
            // (pos.y-posToFill.y) = rad * (pos.x-posToFill.x);
            // (-posToFill.y) = (rad * (pos.x-posToFill.x)) - pos.y;
            // (posToFill.y) = -((rad * (pos.x-posToFill.x)) - pos.y);
            posToFill.y = -((rad * (pos.x-posToFill.x)) - pos.y);
            
        }
        return posToFill;
    },

    posOnCircleByDeg(circle = { x, y, r }, deg = 0) {
        const rad = MathService.degToRadian(deg);
        return {
            x: circle.r * Math.cos(rad) + circle.x,
            y: circle.r * Math.sin(rad) + circle.y
        }
    }
}

// methods to help with creating the actions elements;
const ElementService = {
    El: (() => {
        function getElType(template) {
            if (!(template[0] === '<' && template[template.length-1] === '>')) return;
            if (template[1] === '/') return template.split('/')[1].split(' ')[0].split('>')[0];
            else return template.split('<')[1].split(' ')[0].split('>')[0].split('/')[0];
        }
        return (htmlStr = '', evs = {}, children = []) => {
            let parentType = 'div';
            const elType = getElType(htmlStr);
            if (elType === 'tr') parentType = 'table';
            else if (elType === 'td') parentType = 'tr';
            const parent = document.createElement(parentType);
            parent.innerHTML = htmlStr;
            const el = parent.firstChild;
            for (let evName in evs) el[evName] = evs[evName];
            children.forEach(child => child && el.appendChild(child));
            return el;
        }
    })(),
    
    StyleEl: (() => {
        const CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        function _stringToLowerKabab(str) {
            let fixedStr = '';
            for (let i = 0; i < str.length; i++) {
                let curr = str[i];
                let lowerCurr = curr.toLowerCase();
                if (CAPS.includes(curr)) {
                    if (i === 0) fixedStr += lowerCurr;
                    else if (str[i-1] && (str[i-1] !== ' ')) fixedStr += `-${lowerCurr}`;
                } else fixedStr += lowerCurr;
            }
            return fixedStr;
        }
        return function StyleEl(selector = '', style = {}, tab = 0) {
            const tabStr = '\t'.repeat(tab);
            let styleStr = `${tabStr}${selector} {`;
            let nestedStyle = '';
            for (let key in style) {
                const val = style[key];
                key = _stringToLowerKabab(key);
                if (typeof val === 'object') {
                    const isCssRule = key[0] === '@';
                    if (!isCssRule) {
                        let nestedSelector = selector;
                        if (key[0] === '&') nestedSelector += key.slice(1);
                        else nestedSelector += ` ${key}`;
                        nestedStyle += StyleEl(nestedSelector, val);
                    } else {
                        nestedStyle += `${key} {\n`;
                        nestedStyle += StyleEl(selector, val, 1);
                        nestedStyle += '}\n';
                    }
                }
                else styleStr += `\n${tabStr}\t${key}: ${val};`;
            }
            styleStr += `\n${tabStr}}\n`;
            styleStr += nestedStyle;
            return styleStr;
        }
    })()
}