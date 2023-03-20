import { MathService } from './utils.js';

// board setter - to make sure the board has all the relevant data;
function boardSetter(board) {
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
function boardGetter() {
    return this._board;
}

// doUpdateCell: replace a givven item with the old one on the board;
function doUpdateCell(pos, cell, findIndexCb) {
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
function updateCell(pos, cell, findIndexCb = (currCell) => currCell.id === cell.id) {
    this.doUpdateCell(pos, cell, findIndexCb);
    this.debounceRender();
    // this.renderCell(cell, pos, this.context);
}

// updateCell: get poss and cells and sends them to doUpdateCell, then render;
function updateCells(data = [], findIndexCb = (idx) => (cell) => cell.id === data[idx].id) {
    data.forEach((cell, idx) => this.doUpdateCell({ y: cell.i || cell.y, x: cell.j || cell.x }, cell, findIndexCb && findIndexCb(idx)));
    this.debounceRender();
}

function removeCell(findIdxCbOrItem = (currCell) => currCell.id === cell.id) {
    let idx;
    if (typeof findIdxCbOrItem === 'function') idx = this.board.shapes.findIndex(findIdxCbOrItem);
    else idx = this.board.shapes.findIndex(c => c === findIdxCbOrItem);
    if (idx === -1) return;
    this.board.shapes.splice(idx, 1);
    this.debounceRender();
}
function removeCells(findIdxCbOrItems = (currCell) => currCell.id === cell.id) {
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

// updateCell: gets a new board, then renders it
function updateBoard(board) {
    this.board = board;
    this.init();
}

function doAnimationCellUpdate(cell, findIndexCb) {
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
    const animateKey = cell.code;
    if (!reqAnimations[animateKey]) reqAnimations[animateKey] = {};
    const animateId = this.nextAnimateId++;
    reqAnimations[animateKey].id = animateId;
    const steps = [10,20,35,50,65,80,90,100];
    // const steps = '0'.repeat(Math.abs(parseInt(posDiffs.x))).split('').map((_, idx) => idx+1);
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

const getGridLines = (() => {
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

function isPosOnItem(pos, item, debug) {
    // if (item.degries) return this.isPosInEllipse(pos, item, rotate, acordingToPos);
    let polygon = item.geoShape;
    let acordingToPos = item.x && { x: item.x, y: item.y } || undefined;
    if (!polygon) {
        if (!item.isCenterPos) acordingToPos = item.x && { x: item.x + item.w/2, y: item.y + item.h/2 } || undefined;
        polygon = MathService.rectToPolygon(item, acordingToPos, debug);
    }
    if (MathService.isPosOnPoligon(pos, polygon, item.rotate, acordingToPos)) return true;
    if (item.children?.some(c => this.isPosOnItem(pos, this.parseRenderOpts(undefined, c, item)))) return true;
    return false;
}


export default {
  boardSetter,
  boardGetter,
  doUpdateCell,
  updateCell,
  updateCells,
  removeCell,
  removeCells,
  updateBoard,
  doAnimationCellUpdate,
  getGridLines,
  isPosOnItem
}