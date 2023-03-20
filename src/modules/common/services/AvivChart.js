import { CanvasService } from "./canvasService/canvas.service.js";

export class BaseChart {
  canvasService = null;
  selector = '';
  renderedData = [];
  constructor(
    chartData = null, 
    selector = 'body') {
    this.chartData = chartData;
    this.selector = selector;
    // this.bgc = 'white';
  }
  
  init() {
    this.initService();
  }
  
  destroy() {
    this.canvasService.removeWindowEventListeners();
  }

  getCahrtDataToRender() {
    return [];
  }

  get size() {
    return {
      w: this.chartData.width || 1600,
      h: this.chartData.height || 900,
    }
  }


  initService() {
    // this.renderedData = this.getCahrtDataToRender();
    const isAnimation = !!this.getAnimationFrames;
    const renderData = isAnimation? this.getAnimationFrames() : this.getCahrtDataToRender();
    if (isAnimation) {
      const doAnimate = () => {
        const currData = renderData.shift();
        this.renderedData = currData;
        this.setCanvasService(currData);
        if (renderData.length) requestAnimationFrame(doAnimate);
      }
      requestAnimationFrame(doAnimate);
    } else {
      this.renderedData = renderData;
      this.setCanvasService(this.renderedData);
    }
  }
  
  setCanvasService(data) {
    const board = {
      width: this.size.w || 1600,
      height: this.size.h || 900,
      staticShapes: data
    }
    if (this.canvasService) this.canvasService.updateBoard(board);
    else this.canvasService = new CanvasService(board, { selector: this.selector, enableZoom: false }, null, { mousemove: this.onMouseHover.bind(this), click: this.onClick });
  }

  updateData(chartData) {
    this.chartData = chartData;
    this.initService();
  }

  onClick(ev, pos) {
    // console.log(pos);
  }

  findRenderedItemPosMatch(pos, edge = false) {
    return this.renderedData.find(c => c.hoveredData && CanvasService.isPosOnItem(pos, c, edge));
  }

  onMouseHover(ev, pos) {
    // return;
    const hoveredItem = this.findRenderedItemPosMatch(pos);
    const elCanvas = this.canvasService.elCanvas;
    if (!hoveredItem) {
      elCanvas.style.cursor = 'default';
      return;
    }
    elCanvas.style.cursor = 'pointer';
    const hoveredData = hoveredItem.hoveredData
    let msg = hoveredData.item.tag
    if (hoveredData.label) msg += '\n' + hoveredData.label;
    if (hoveredData.val) msg +=  '\n' + hoveredData.val;
    // console.log(msg)
  }
}



const defaultChartData = { 
  data: [
    // {tag: 'dataSample1', vals: [10, 73, 40]},
    // {tag: 'dataSample2', vals: [50, -50, 30]}
  ], 
  width: 1600,
  height: 900,
  // labels: ['sep', 'oct', 'nov'],
  labels: [],
  horizontal: false,
  labelsNegative: false,
  dataNegative: false,
  info: {
    disable: false,
    position: 'right',
    align: 'middle',
    size: 40
  },
  legend: {
    tag: 'This is a legend',
    position: 'top',
    align: 'center'
  },
  style: {}
}


export class BaseDataChart extends BaseChart {
  constructor(chartData = defaultChartData, ...args) {
    super(UTILS.fillData(chartData, defaultChartData, ['legend']), ...args);
    this.strictItemSize = false;
    this.init();
  }


  static defaultColors = [
    '#fdaaaa',
    '#b4ffd9',
    '#fcfdcd',
    '#f2ddff',
    '#abcdeb',
  ];
  static defClrByIdx(idx) {
    return this.defaultColors[idx] || this.defaultColors[0];
  }
  static getClrFromStyle(style, idx) {
    return style?.color || this.defClrByIdx(idx)
  }

  get textStyle() {
    return { strokeStylee: 'black', fillStyle: 'black', fontWeight: '600', font: 'sans-serif', size: 40, ...(this.chartData.style || {}) };
  }

  
  get chartDataUtils() {
    const { size, chartData, strictItemSize } = this;
    const { horizontal, labelsNegative, dataNegative } = chartData;
    const mainAxis = !horizontal ? 'x' : 'y';
    const secAxis = mainAxis === 'x' ? 'y' : 'x';
    const { main: mainSizeKey, sec: secSizeKey } = this.constructor.sizeKeyByAlignOrAxis(mainAxis);
    const pad = this.totalPad;
    const dataAreaSize = { w: size.w-pad.right-pad.left, h: size.h-pad.top-pad.bottom };
    const start = { x: pad.left, y: pad.top };
    const end = { x: start.x+dataAreaSize.w, y: start.y+dataAreaSize.h };
    const { min, max } = chartData.data.reduce((acc, c) => ({
      min: Math.min(acc.min, ...(c.vals || [c.val || 0])),
      max: Math.max(acc.max, ...(c.vals || [c.val || 0])),
    }), { min: strictItemSize? 0 : Infinity, max: -Infinity });
    const dataRangeSize = max - min;
    const yByVal = (val) => dataNegative? end.y - dataAreaSize.h*((max-val)/dataRangeSize) : start.y + dataAreaSize.h*((max-val)/dataRangeSize);
    const xByVal = (val) => dataNegative? start.x + dataAreaSize.w*((max-val)/dataRangeSize) : end.x - dataAreaSize.w*((max-val)/dataRangeSize);
    const secByVal = (val) => secAxis === 'y' ? yByVal(val) : xByVal(val);
    const mainByVal = (val) => secAxis === 'x' ? xByVal(val) : yByVal(val);
    const axisValGap = {
      [mainAxis]: dataAreaSize[mainSizeKey]/(chartData.labels.length-(strictItemSize? 0 : 1)),
      [secAxis]: dataAreaSize[secSizeKey]/(chartData.labels.length-(strictItemSize? 0 : 1)),
    }
    // const addToIdx = ((horizontal&&strictItemSize) || (labelsNegative&&!horizontal))? 1 : 0;
    // const addToIdx = (strictItemSize && !horizontal)? 1 : 0;
    const addToIdx = ((strictItemSize && !horizontal && labelsNegative) || (!labelsNegative && strictItemSize && horizontal))? 1 : 0;
    const xByIdx = (idx) => labelsNegative? end.x - axisValGap.x*(idx+addToIdx) : start.x + axisValGap.x*(idx+addToIdx);
    const yByIdx = (idx) => labelsNegative? start.y + axisValGap.y*(idx+addToIdx) : end.y - axisValGap.y*(idx+addToIdx);
    const mainByIdx = (idx) => mainAxis === 'x'? xByIdx(idx) : yByIdx(idx);
    const secByIdx = (idx) => secByAxis === 'y'? yByIdx(idx) : xByIdx(idx);
    return { pad, start, end, minVal: min, maxVal: max, mainAxis, secAxis, xByVal, yByVal, mainByVal, secByVal, xByIdx, yByIdx, secByIdx, mainByIdx, axisValGap, dataAreaSize, mainSizeKey, secSizeKey };
  }



  static sizeKeyByAlignOrAxis(key) {
    switch (key) {
      case 'y':
      case 'top':
      case 'bottom':
        return { main: 'h', sec: 'w' };
      case 'x':
      case 'left':
      case 'right': ;
        return { main: 'w', sec: 'h' };
      default:
        return {};
    }
  }
  static axisBySizeKeyOrAlign(key) {
    switch (key) {
      case 'h':
      case 'top':
      case 'bottom':
        return { main: 'y', sec: 'x' };
      case 'w':
      case 'left':
      case 'right': ;
        return { main: 'x', sec: 'y' };
      default:
        return {};
    }
  }


  get initPad() {
    return { top: 0, bottom: 50, right: 0, left: 100 };
  } 
  get padding() {
    const updatePad = (pad, item, padKey) => {
      const sectionsGap = 25;
      const { main: sizeKey } = this.constructor.sizeKeyByAlignOrAxis(padKey);
      pad[padKey] = Math.max(pad[padKey], item[sizeKey] + sectionsGap);
    }
    const pad = { ...this.initPad };
    if (this.chartData.legend) updatePad(pad, this.legendSectionSize, this.chartData.legend.position);
    if (!this.chartData.info?.disable) updatePad(pad, this.infoSectionSize, this.chartData.info.position);
    return pad;
  }

  get extraPadForData() {
    return { top: 50, bottom: 50, right: 50, left: 50 };
  }

  get totalPad() {
    const { padding: pad, extraPadForData: exPAd } = this;
    const _morePadIfElIn = (posName) => {
      const { infoSectionsPos } = this;
      // console.log(infoSectionsPos)
      for (let item of [infoSectionsPos.info, infoSectionsPos.legend]) {
        if (item.disable) continue;
        if ([item.align, item.position].includes(posName)) return 50;
      }
      return 0;
    }
    return {
      top: pad.top + exPAd.top + _morePadIfElIn('top'),
      bottom: pad.bottom + exPAd.bottom + _morePadIfElIn('bottom'),
      right: pad.right + exPAd.right + _morePadIfElIn('right'),
      left: pad.left + exPAd.left + _morePadIfElIn('left')
    }
  }

  calcSectionRenderPos(item, size, {position, align, disable}) {
    const { extraPadForData } = this;
    const pos = {
      position, align,
      x: size.w/2 - item.w/2,
      y: size.h/2 - item.h/2,
      disable
    };

    const { main: mainSizeKey, sec: secSizeKey } = this.constructor.sizeKeyByAlignOrAxis(position);
    const { main: mainAxis, sec: secAxis } = this.constructor.axisBySizeKeyOrAlign(position);
    
    switch (align) {
      case 'start':
        pos[secAxis] = secAxis === 'y' ? extraPadForData.top : extraPadForData.left;
        break;
      case 'end':
        pos[secAxis] = size[secSizeKey] - item[secSizeKey] - (secAxis === 'y' ? extraPadForData.bottom : extraPadForData.right);
        break;
      case 'middle':
      case 'center':
        break;
    }
    switch (position) {
      case 'top':
        pos.y = extraPadForData.top;
        break;
      case 'bottom':
        pos.y = size.h - item.h - extraPadForData.bottom;
        break;
      case 'right':
        pos.x = size.w - item.w - extraPadForData.right;
        break;
      case 'left':
        pos.x = extraPadForData.left;
        break;
      case 'middle':
      case 'center':
        break;
    }
    return pos;
  }


  get infoSectionsPos() {
    const { size, infoSectionSize, legendSectionSize, chartData } = this;
    return {
      info: this.calcSectionRenderPos(infoSectionSize, size, {
        position: chartData.info.position, align: chartData.info.align, disable: !!chartData.info.disable
      }),
      legend: this.calcSectionRenderPos(legendSectionSize, size, {
        position: chartData.legend?.position, align: chartData.legend?.align, disable: !!chartData.legend
      }),
      // legend: { x: start.x + dataAreaSize.w/2, y: 250 }
    }
  }
  

  get infoSectionSize() {
    const lineHeight = this.chartData.info.size || 30;
    
    const gap = (lineHeight/3)*2;
    const itemsCount = this.chartData.data.length;
    const totalHeight = itemsCount * lineHeight + (itemsCount-1) * gap;
    // clac width:
    const longestLine = this.chartData.data.reduce((acc, c) => {
      if (c.tag.length > acc.length) return c.tag;
      return acc;
    }, '');
    const lineSize = UTILS.getTextPxSize(longestLine, lineHeight, this.textStyle.font);
    return {
      lineHeight,
      gap,
      h: totalHeight,
      w: lineHeight + gap + lineSize,
    }
  }

  get legendSectionSize() {
    const h = this.chartData.legend?.size || 50;
    // console.log(this.legend?.tag, h, UTILS.getTextPxSize(this.legend?.tag, h));
    // return UTILS.getTextPxSize(this.legend?.tag, h);
    return { h, w: UTILS.getTextPxSize(this.legend?.tag, h, this.textStyle.font) }; 
  }
  
  getChartInfoRenderData() {
    const { chartData, } = this;

    const textBaseStyle = this.textStyle;

    const res = [];

    const zIndex = 2;

    // info;
    if (!chartData.info?.disable) {
      const infoSize = this.infoSectionSize;
      const infoPos = this.infoSectionsPos.info;
      res.push(...chartData.data.reduce((acc, curr, idx) => {
        const y = infoPos.y + (infoSize.lineHeight+infoSize.gap)*(idx);
        const hoveredData = { item: curr };
        acc.push(
          {
            style: { ...textBaseStyle, textBaseline: 'top' },
            // isCenterPos: true,
            text: curr.tag,
            x: infoPos.x+infoSize.lineHeight,
            y,
            w: infoSize.lineHeight,
            hoveredData,
            zIndex
          },
          {
            style: { fillStyle: this.constructor.getClrFromStyle(curr.style, idx), strokeStyle: 'gray' },
            // isCenterPos: true,
            x: infoPos.x,
            y,
            w: infoSize.lineHeight,
            h: infoSize.lineHeight,
            hoveredData,
            zIndex
          }
        );
        return acc;
      }, []));
    }

    // legend;
    if (chartData.legend) {
      const legendPos = this.infoSectionsPos.legend;
      res.push(
        {
          ...legendPos,
          w: this.legendSectionSize.h,
          isCenterPos: true,
          text: chartData.legend.tag,
          style: { ...textBaseStyle, textBaseline: 'top', textAlign: 'start' },
          zIndex
        }
      )
    }

    return res;
  }

  getGridRenderData() {
    const res = [];
    
    const { chartData } = this;
    const { start, end, minVal, maxVal, mainAxis, secAxis, yByVal, xByVal, yByIdx, xByIdx } = this.chartDataUtils;

    // chart outline
    const gridStyle = { strokeStyle: 'gray', lineWidth: 3 };
    const outPad = 15; // outline padding
    // const outPad = 0; // outline padding
    const exPad = this.extraPadForData;
    res.push(
      { style: gridStyle, geoShape: [ { x: start.x-exPad.left/2, y: start.y-exPad.top }, { x: start.x-exPad.left/2, y: end.y+exPad.bottom } ] },
      { style: gridStyle, geoShape: [ { x: start.x-exPad.left, y: end.y+exPad.bottom/2 }, { x: end.x+exPad.left/2, y: end.y+exPad.bottom/2 } ] }
    );
      
    const textBaseStyle = this.textStyle;

    const valLabels = [parseInt(minVal), parseInt(maxVal)];
    if (minVal < 0 && maxVal > 0) valLabels.push(0);
    const dataValRange = maxVal-minVal;
    const valLabelsStep = parseInt(dataValRange/8);
    const iterates = valLabelsStep? dataValRange/valLabelsStep : 0;
    for (let i = 0; i < iterates; i++) {
      const curr = parseInt(minVal+valLabelsStep*i);
      if (
          Math.abs(maxVal - curr) < valLabelsStep || 
          Math.abs(minVal - curr) < valLabelsStep
          || Math.abs(0 - curr) < valLabelsStep
      ) continue
      valLabels.push(curr);
    }
    

    // sec axis labels and grid;
    const secAxisLabels = secAxis === 'y' ? valLabels : chartData.labels;
    res.push(...secAxisLabels.reduce((acc, c, i) => {
      const y = secAxis === 'y' ? yByVal(c) : yByIdx(i);
      acc.push(
        {
          x: start.x - exPad.left*1.5,
          y,
          w: textBaseStyle.size,
          text: c.toString(),
          style: { ...textBaseStyle, textBaseline: 'middle', textAlign: 'right' },
        },
        {
          geoShape: [{ x: start.x-exPad.left/2, y }, {x: end.x+exPad.bottom/2, y}],
          style: { ...gridStyle, lineWidth: 1 },
        }
      )
      return acc;
    }, []));

    // main axis labels and grid;
    const mainAxisLabels = mainAxis === 'x' ? chartData.labels : valLabels.reverse();
    res.push(...mainAxisLabels.reduce((acc, c, i) => {
      const x = mainAxis === 'x' ? xByIdx(i) : xByVal(c);
      acc.push(
        {
          x: x - exPad.left/2,
          y: end.y + exPad.bottom,
          w: textBaseStyle.size,
          text: c.toString(),
          style: { ...textBaseStyle, textBaseline: 'top', textAlign: 'center' }
        },
        {
          geoShape: [{ x, y: start.y-exPad.top }, {x, y: end.y+exPad.bottom/2}],
          style: { ...gridStyle, lineWidth: 1 },
        }
      )
      return acc;
    }, []));

    return res;
  }



  fullGraphDataToRender() {
    return [...this.getGridRenderData(), ...this.getChartInfoRenderData()];
  }


  getCahrtDataToRender() {
    return [...this.fullGraphDataToRender()];
  }

  get animationSteps() { 
    let steps = '0'.repeat(100).split('').map((_, i) => (i+1)/100);
    // steps = steps.filter(c => (c*100)%2 === 0);
    // return steps;

    const res = [];
    const stepGroups = [];
    const groupsCount = 8;
    for (let i = 0; i < groupsCount; i++) stepGroups.push(steps.slice(steps.length/groupsCount*i, steps.length/groupsCount*(i+1)));
    stepGroups.reverse().forEach((curr, idx) => {
      res.push(...curr.filter((c, i) => i%(idx+1) === 0));
    });
    res.sort((a, b) => a - b);
    return res;
  }

  getAnimationFrames() {
    const data = this.chartData.data;
    const frames = [];
    const { animationSteps } = this;
    for (let step of animationSteps) {
      frames.push(this.getCahrtDataToRender(data.map(c => ({
        ...c,
        vals: c.vals?.map(c => c*step),
        val : c.val*step
      }))))
    }
    return frames;
  }
}

export class LineChart extends BaseDataChart {
  getCahrtDataToRender(data) {
    const { secByVal, mainByIdx, mainAxis, secAxis } = this.chartDataUtils;
    if (!data) data = this.chartData.data;
    return[
      ...this.fullGraphDataToRender(),
      ...data.map((curr, idx) => ({
        style: { strokeStyle: this.constructor.getClrFromStyle(curr.style, idx), lineWidth: 5, lineCap: 'round' },
        geoShape: curr.vals.map((c, i) => ({ [mainAxis]: mainByIdx(i), [secAxis]: secByVal(c) })),
        // hoveredData: { item: curr }
      }))
    ];
  }

  // findRenderedItemPosMatch(pos) {
  //   super.findRenderedItemPosMatch(pos, true);
  // }
}

export class BarChart extends BaseDataChart {
  init() {
    this.strictItemSize = true;
    super.init();
  }
  getCahrtDataToRender(data) {
    const { chartData } = this;
    const { secByVal, mainByIdx, mainAxis, secAxis, dataAreaSize, mainSizeKey } = this.chartDataUtils;
    if (!data) data = this.chartData.data;
    const pad = 5;
    const barW = (dataAreaSize[mainSizeKey]/chartData.labels.length)/chartData.data.length - pad;
    return [
      ...this.fullGraphDataToRender(),
      ...data.reduce((acc, curr, idx) => {
        acc.push(
          ...curr.vals.map((val, i) => ({
            geoShape: [
              { [secAxis]: secByVal(0),   [mainAxis]: mainByIdx(i)+(barW)*idx+(pad*idx) },
              { [secAxis]: secByVal(val), [mainAxis]: mainByIdx(i)+(barW)*idx+(pad*idx) },
              { [secAxis]: secByVal(val), [mainAxis]: mainByIdx(i)+(barW)*(idx+1)+(pad*idx) },
              { [secAxis]: secByVal(0),   [mainAxis]: mainByIdx(i)+(barW)*(idx+1)+(pad*idx) },
            ],
            style: { fillStyle: this.constructor.getClrFromStyle(curr.style, idx) },
            hoveredData: { item: curr, val, label: chartData.labels?.[i] }
          })),
        );
        return acc;
      }, [])
    ]
  }
}

export class PiChart extends BaseDataChart {
  static getItemVal(item) {
    let val = item.val || item.vals?.[0] || 0;
    if (val < 0) val = 0;
    return val;
  }
  get size() {
    return {
      w: 1000,
      h: this.chartData.info?.disable ? 1000 : 800
    }
  }
  get initPad() {
    return { top: 10, bottom: 10, right: 10, left: 10 };
  }
  get extraPadForData() {
    return { top: 10, bottom: 10, right: 10, left: 10 };
  }
  init() {
    this.chartData.info.position = 'left';
    // this.chartData.info.size = 60;
    this.initService();
  }
  
  get piSize() {
    const { dataAreaSize } = this.chartDataUtils;
    return Math.min(dataAreaSize.w, dataAreaSize.h);
  }
  
  get piPos() {
    const { size } = this;
    const { dataAreaSize, start } = this.chartDataUtils;
    return { x: start.x + dataAreaSize.w/2, y: start.y + dataAreaSize.h/2 };
    // return { x: size.w/2 + size.w/7, y: size.h/2+size.h/16 };
  }
  get baseCircleItem() {
    return {
      ...this.piPos,
      w: this.piSize,
      h: this.piSize,
      circleDegries: 360,
      style: { strokeStyle: 'white', lineWidth: 7.5 },
    }
  }
  getCahrtDataToRender() {
    const { chartData } = this;
    const valsSum = chartData.data.reduce((acc, c) => acc + (this.constructor.getItemVal(c)), 0);
    let lastEndDeg = 0;
    return [
      ...this.getChartInfoRenderData(),
      ...chartData.data.map((curr, idx) => {
        const val = this.constructor.getItemVal(curr);
        const percentages = val / valsSum;
        const startDeg = lastEndDeg;
        const endDeg = startDeg + 360*percentages;
        lastEndDeg = endDeg;
        return {
          ...this.baseCircleItem,
          circleDegries: [startDeg, endDeg],
          closeCircle: true,
          style: { ...this.baseCircleItem.style, fillStyle: this.constructor.getClrFromStyle(curr.style, idx) },
          hoveredData: { item: curr, val }
        }
      })
    ]
  }
  getAnimationFrames() {
    const finalData = this.getCahrtDataToRender();
    const frames = [];
    // const animationSteps = [0, 10,20,35,50,65,80,90,100].map(c => c/100);
    const animationSteps = this.animationSteps;
    for (let i = 0; i < animationSteps.length; i++) {
      const currFrame = finalData.map(c => {
        if (c.clearCircle) return c;
        return {
          ...c,
          circleDegries: Array.isArray(c.circleDegries)? c.circleDegries.map(c => c*animationSteps[i]) : c.circleDegries*animationSteps[i]
        }
      });
      frames.push(currFrame);
    }
    return frames;
  }
}
export class DonatChart extends PiChart {
  get donatHoleSize() {
    return this.piSize/2;
  }

  get centerCircle() {
    return {
      ...this.baseCircleItem,
      w: this.donatHoleSize,
      h: this.donatHoleSize
    }
  }

  findRenderedItemPosMatch(pos) {
    const hoveredItem = super.findRenderedItemPosMatch(pos);
    return hoveredItem && !CanvasService.isPosOnItem(pos, this.centerCircle) && hoveredItem;
  }

  getCahrtDataToRender() {
    return [
      ...super.getCahrtDataToRender(),
      {
        clearCircle: true,
        ...this.centerCircle,
        closeCircle: true,
        style: { clear: true },
      },
      { ...this.centerCircle }
    ]
  }
}
export class DiscChart extends DonatChart {
  get donatHoleSize() {
    return this.piSize*0.9;
  } 
}
export class FrameDiscChart extends DiscChart {
  init() {
    this.chartData.info.position = 'center';
    this.chartData.info.size = 60;
    this.initService();
  }
  get size() {
    return {
      w: 1000,
      h: 1000
    }
  }
}


export class Heatmap extends BaseChart {
  calcedDataCash = null;

  constructor(heatData = { width: 100, height: 100, data: [] }, selector, autoCalc = false) {
    super(heatData, selector);
    this.autoCalc = autoCalc;
    this.init();
  }

  updateData(chartData) {
    this.calcedDataCash = null;
    super.updateData(chartData);
  }

  get heatData() { return this.chartData; }
  
  getCahrtDataToRender() {
    return this.getheatPointsToRender(this.calcedData);
  }

  get calcedData() {
    if (this.calcedDataCash) return this.calcedDataCash;
    this.calcedDataCash = this.autoCalc? this.constructor.calcHeatMapData(this.heatData) : this.heatData;
    return this.calcedDataCash;
  }
  
  getheatPointsToRender = (() => {
    const _colorBySevirity = (sevirity, opacity = 1) => {
      // sevirity = Math.floor(sevirity*11)
      // if (sevirity > 11) sevirity = 11;
      // else if (sevirity < 0) sevirity = 0;
      // sevirity = [0,1,2,3,4,5,6,7,8,9,10][sevirity]/10;

      if (sevirity > 1) sevirity = 1;
      else if (sevirity < 0) sevirity = 0;
      return `hsla(${200*(1-sevirity)},100%,50%,${opacity})`;  // 1 is red, 120 is green;  // 240 == blue, 300 == pink, 180 == lightBlue;
    }
    const _getHeatPoinToRenderPart = (heatPoint, sevirity, idx, partsCount) => {
      const percentages = (idx+1)/partsCount;
      const negativePercentages = (partsCount-idx)/partsCount;
      const currSevirity = sevirity * percentages;
      const fullSize = 140*sevirity;
      const mainPart = (0.6*fullSize)*sevirity;
      const restSize = fullSize-mainPart;
      const size = mainPart + restSize*negativePercentages;
      const shadowDist = 2000;
      return {
        ...heatPoint,
        id: heatPoint._id || makeId(),
        style: {
          // shadowBlur: 10,
          shadowColor: _colorBySevirity(currSevirity),
          shadowOffsetY: (heatPoint.y+shadowDist),
          // fillStyle: _colorBySevirity(currSevirity),
        },
        x: heatPoint.x,
        // y: heatPoint.y,
        y: -shadowDist,
        w: size, h: size, circleDegries: 360,
        zIndex: 1+currSevirity
      };
    }
    const _mapHeatPointToRender = (heatPoint) => {
      const sevirity = this.sevirityByNegs(heatPoint.negsCount, heatPoint.negsDistAvg);
      const depth = 10;
      const res = [];
      for (let i = 0; i < depth; i++) res.push(_getHeatPoinToRenderPart(heatPoint, sevirity, i, depth));
      return res;
    }
    return (heatData) => {
      return heatData.data.reduce((acc, c) => ([...acc, ..._mapHeatPointToRender(c)]), [])
    }
  })();
  sevirityByNegs(negsCount = 0, distAvg = 0) {
    const distSevirity = 1 - (distAvg / this.heatData.negMaxDist);;
    const countPercentagesToMax = 1 - (negsCount / this.heatData.maxNegsCount);
    const distPower = 0.25;
    const percentPwer = 1- distPower;
    const sevirity = distSevirity*distPower + countPercentagesToMax*percentPwer;
    return 1 - sevirity;
  }

  static calcHeatMapData = (() => {
    const negMaxDist = 300;
    const lotsOfIncidents = 10000;
    function _getNegsData(pos = { x: 0, y: 0 }, positions) {
      const negsCountLimit = positions.length >= lotsOfIncidents? parseInt(positions.length/5) : Infinity;
      let distSum = 0;
      const negs = [];
      for (let i = 0; i < positions.length; i++) {
        const curr = positions[i];
        if (curr._id === pos._id) continue;
        const w = Math.abs(pos.x - curr.x);
        const h = Math.abs(pos.y - curr.y);
        const dist = Math.sqrt(w**2 + h**2); // Pythagoras;
        // const dist = Math.abs(pos.x - curr.x) + Math.abs(pos.y - curr.y);
        if (dist <= negMaxDist) {
          negs.push(curr);
          distSum += dist;
        }
        if (negs.length >= negsCountLimit) break;
      }
      const total = negs.length;
      return { negs, total, distAvg: distSum/total };
    }
    return (heatData) => {
      const positions = heatData.data;
      let maxNegsCount = 0;
      const data = positions.map(c => {
        const negsData = _getNegsData(c, positions);
        if (negsData.total > maxNegsCount) maxNegsCount = negsData.total;
        return { ...c, negsCount: negsData.total, negsDistAvg: negsData.distAvg };
      });
      return { data, negMaxDist, maxNegsCount };
    }
  })();
}



const UTILS = {
  getDeepKey: function(key = '', endPoint = '', isIdx = false) {
    if (!key) return endPoint;
    if (isIdx) return `${key}[${endPoint}]`;
    return `${key}.${endPoint}`;
  },
  fillData: function(data, fillBy, avoid = [], deepKey = '') {
    if (fillBy && typeof fillBy === 'object') fillBy = JSON.parse(JSON.stringify(fillBy));
    if (avoid.includes(deepKey) && !data) return data;
    if ((typeof data) !== 'object') return data;
    if (Array.isArray(data)) return data.map((c,i) => UTILS.fillData(c, fillBy[i], avoid, UTILS.getDeepKey(deepKey, i, true)))
                                    //  .filter((c, i) => !avoid.includes(UTILS.getDeepKey(deepKey, i, true)));
    const res = { ...data };
    for (let key in fillBy) {
      const currDeepKey = UTILS.getDeepKey(deepKey, key, false);
      if ((typeof data[key]) === 'object') res[key] = UTILS.fillData(data[key], fillBy[key], avoid, currDeepKey);
      if (avoid.includes(currDeepKey) && !data[key]) continue;
      else if (!data[key]) res[key] = fillBy[key];
    }
    return res;
  },
  
  getTextPxSize: function(text, size, fontStyle = 'Ariel') {
    const _context = document.createElement('canvas').getContext('2d');
    _context.font = `${size}px ${fontStyle}`;
    const textSize = _context.measureText(text).width;
    // const testEl = document.createElement('div');
    // testEl.style = `display:inline-block;width:auto;height:auto;font-size:${size}px;`;
    // testEl.innerText = text;
    // console.dir(text, size, testEl);
    // const textW = { w: testEl.offsetWidth, h: testEl.offsetHeight };
    return textSize;
  }
}
