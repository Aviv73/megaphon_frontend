/**
 * Cnavas Service
 * The role of this file is to help whith canvas renderation and paint logic
 * 
 * 
 * examples for boards can be sent to the service:
 * 
 * 
 * 
*/
 const matrixBoard = [
     ['*', '*', '*'],
     ['*', '*', '*'],
     ['*', '*', RenderOpts],
 ];

 // Enumerator: One of opts      | example: Enumerator('north', 'west') means you can put 'north'/'west' as the value of the property
 // Range:      A number between | example: Range(0, 100) means you can put any number between 1 and 100 as the value of the property

 const RenderOpts = {
    hide: Boolean,
    style: {
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
            autoCalcGeoShapeSize: Boolean // for gradientBgc
        },
        linePattern: [Number], // for serLineDash context method;
        strictLinePattern: [Number], // for serLineDash context method;
        circleCounterClockWise: Boolean,
        lineCap: Enumerator('round')
    },
    img: Enumerator(String('SOME_IMG.src'), ElementImage),         // for image rendering
    text: String,                                   // for text rendernig
    geoShape: [{X: Number, y: Number}],             // for geoshape rendering
    degries: Range(0, 360), // [StartDeg, endDeg]     // for circle rendering
    grid: { x: { space: Number, align: Enumerator('start', 'center', 'end', strictSpace = Number ) || Number, rotate, style }, y: {}, space, style, align, rotate, strictSpace },          // for grid lines rendering
    closeCircle: Boolean,

    zIndex: Number,                      // 

    mirror: Boolean,
    scale: [x, y],
    strictScale: [x, y],
    dontScale: Boolean,

    flip: Boolean,

    strictW: Number,
    strictH: Number,
    strictX: Number,
    strictY: Number,
    strictR: Number, // strict rotation
    isCenterPos: Boolean,
    rotate: Range(0, 360),
    x: Number,
    y: Number,
    w: Number,
    h: Number,

    children: [RenderOpts] // nested opts - position are relative to parent, no rotation; works fine for cercle and geoShape
}
 
 const nonMatrixBoard = {
     width: 100,
     height: 100,
     shapes: [RenderOpts],
     staticShapes: [RenderOpts]
 };

 // Examplae for a render cell call back function:
 // item is each cell in the board mat, or each itemon the board shapes;
 const getCellContentCb = (item, drawOpts, context) => {
    context.beginPath();
    context.strokeStyle = 'yellow';
    const width = 50*drawOpts.zoomLevel;
    const height = 40*drawOpts.zoomLevel;
    const startX = drawOpts.actualX - width/2;
    const startY = drawOpts.actualY - height/2;
    context.rect(startX, startY, width, height);
    context.stroke();
 
    if (item.type === 'wall') return { h: 15, w: 15, rotate: item.direcrion, fillStyle: 'green', strokeStyle: 'white'};
    if (item.type === 'player')  return { h: 15, w: 15, text: '🦊', textColor: 'black', textAlign: 'center', textBaseline: 'middle'};
    if (item.type === 'image') return { h: 30, w: 30, rotate: item.direcrion, img: imgSrc };
 }