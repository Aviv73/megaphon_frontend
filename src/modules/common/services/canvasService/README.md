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
            strokeStyle: 'black',
            linePattern: [10, 10]
        }
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
        },
        linePattern: [Number], // for setLineDash context method;
        strictLinePattern: [Number], // for setLineDash context method;
        circleCounterClockWise: Boolean,
        lineCap: Enumerator('round')
    },
    img: Enumerator(String('SOME_IMG.src'), ElementImage),  // for image rendering
    text: String,                                           // for text rendernig
    geoShape: [{X: Number, y: Number}],                     // for geoshape rendering
    degries: Range(0, 360),                                 // [StartDeg, endDeg]     // for circle rendering
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