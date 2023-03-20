import { MathService, Utils } from './utils.js';

function parseRenderOpts(shape = {}, reqOpts = {}, relativeTo) {
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
        isCenterPos: shape.isCenterPos || ((shape.degries || reqOpts.degries) && true),
        geoShape: shape.geoShape,
        img: shape.img,
        degries: shape.degries,
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
            lineCap: shape.lineCap,
            shadowBlur: shape.style.shadowBlur,
            shadowColor: shape.style.shadowColor,
            shadowOffsetX: shape.style.shadowOffsetX,
            shadowOffsetY: shape.style.shadowOffsetY,
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

function fixRenderOptsStyle(opts) {
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
    if (opts.degries && !Array.isArray(opts.degries)) opts.degries = [0, opts.degries];
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

function getRenderOpts(shape = {}, reqOpts = {}, parent = null) {
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

// renderShpe: converts the shape data to render format and sens it to doRenderData method;
function renderShape(opts) {
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
function loadImage(src) {
    if (this.canvasOpts.loadImgCb) return this.loadImgCb(src);
    return new Promise((resolve, reject) => {
        const elImage = new Image();
        elImage.src = src;
        elImage.onload = () => resolve(elImage);
    });
}

// doRenderData: gets render opts and renders it to the canvas;
function doRenderData(opts) {
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
        } else if (opts.degries) {
            const degries = opts.degries;
            const startAngle = MathService.degToRadian(degries[0] || 0);
            const endAngle = MathService.degToRadian(degries[1] || 360);
            // const centerPos = isNested? { x: opts.x || 0, y: opts.y || 0 } : { x: 0, y: 0 };
            // const centerPos = { x: opts.x || 0, y: opts.y || 0 };
            const centerPos = { x: 0, y: 0 };
            if (opts.closeCircle) context.lineTo(centerPos.x, centerPos.y);
            context.ellipse(centerPos.x, centerPos.y, renderW/2, renderH/2, 0, startAngle, endAngle, style.circleCounterClockWise);
            // if (opts.closeCircle) context.lineTo(centerPos.x, centerPos.y);
        } else if (opts.text) {
            if (context.font) context.font = renderW + 'px ' + style.font || 'Ariel';
            if (style.textAlign) context.textAlign = style.textAlign;
            if (style.textBaseline) context.textBaseline = style.textBaseline;
            if (style.fillStyle || style.gradientBgc) context.fillText(opts.text, 0, 0);
            if (style.strokeStyle) context.strokeText(opts.text, 0, 0);
        } else {
            if (style.fillStyle || style.gradientBgc) context.fillRect(renderX, renderY, renderW, renderH);
            if (style.strokeStyle) context.rect(renderX, renderY, renderW, renderH);
        } 
        if (style.fillStyle || style.gradientBgc || style.shadowColor) context.fill();
        if (style.strokeStyle) context.stroke();
        context.closePath();
    }
    context.restore();

    if (opts.children?.length) opts.children.forEach(childOpt => this.renderShape(childOpt));
}

// renderCell: gets a board cell and sends it to renderShape with render opts recieved from getCellContectCb;
function renderCell(cell, pos = { y: cell.i || cell.y, x: cell.j || cell.x }) {
    const opts = this.getDynamicRenderOpts(cell, pos);
    opts.forEach(opt => this.renderShape(opt));
}

function getDynamicRenderOpts(cell, pos = { y: cell.i || cell.y, x: cell.j || cell.x }) {
    if (cell.hide) return [];
    const drawOpts = this.getDrawOpts({...this.flipItem({ x: pos.x, y: pos.y, w: cell.w, h: cell.h })});
    let opts = (this.getCellContectCb) ? this.getCellContectCb(cell, drawOpts, this.context, this) : {};
    if (!opts) opts = [];
    else if (!Array.isArray(opts)) opts = [opts];
    return opts.map(curr => this.getRenderOpts(cell, curr));
}

function getAutoStaticShapes() {
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

function resetMapedStaticShapesToRender() {
    this.mapedStaticShapesToRender = null;
}
function getStaticShapesToRender() {
    if (this.mapedStaticShapesToRender) return this.mapedStaticShapesToRender;
    this.mapedStaticShapesToRender = [...this.getAutoStaticShapes(), ...this.board.staticShapes].map(c => this.getRenderOpts(c));
    return this.mapedStaticShapesToRender;
}

// render: renders all the data and static shapes in the board using renderShape and renderCell methods
function render() {
    const { context } = this;
    context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
    const { board } = this;
    // this.getAutoStaticShapes().forEach(c => this.renderShape(this.getRenderOpts(c)));
    if (!this.isMatrixBoard) {
        const dataToRender = [];
        dataToRender.push(...this.getStaticShapesToRender());
        // if (board.staticShapes) dataToRender.push(...board.staticShapes.map(curr => this.getRenderOpts(curr)));
        if (board.shapes && this.isRenderData) dataToRender.push(...board.shapes.reduce((acc, curr) => [...acc, ...this.getDynamicRenderOpts(curr)], []));
        dataToRender.sort((a, b) => a.zIndex - b.zIndex);
        dataToRender.forEach(curr => this.renderShape(curr));
    }
    else if (this.isRenderData) {
        this.getAutoStaticShapes().forEach(c => this.renderShape(this.getRenderOpts(c)));
        // this.mapedStaticShapesToRender.forEach(curr => this.renderShape(curr));
        board.forEach((arr, y) => arr.forEach((cell, x) => this.renderCell(cell, { y, x })));
    }

    if (this.listeners.render) this.listeners.render();
    
}

function debounceRender(force = false) {
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


export default {
  parseRenderOpts,
  fixRenderOptsStyle,
  getRenderOpts,
  renderShape,
  loadImage,
  doRenderData,
  renderCell,
  getDynamicRenderOpts,
  getAutoStaticShapes,
  resetMapedStaticShapesToRender,
  getStaticShapesToRender,
  render,
  debounceRender
}