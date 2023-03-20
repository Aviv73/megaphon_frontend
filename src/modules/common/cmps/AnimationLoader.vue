<template>
  <div class="animated-loader-container"></div>
</template>

<script>
import { CanvasService, MathService } from '../services/canvasService/canvas.service';
import { getRandomColor, getRandomId, getRandomInt } from '../services/util.service';
export default {
  name: 'AnimatedLoader',
  props: {
    negative: Boolean
  },
  data() {
    return {
      destroyCanvas: null,
      animationInterval: null
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.destroyCanvas?.();
    clearInterval(this.animationInterval);
  },
  methods: {
    init() {
      const closeShape = false;
      const randomize = true;
      const colorize = true;
      const showAllConnections = true;
      const startFrom0 = false
      const fibo = false;
      const flipedFibo = false;
      const angles = 12;
      // const speed = 0.6;
      const speed = 0.3;
      const { negative } = this;
      const _angles = randomize && getRandomInt(2, 15) || angles || 12;
      const split1To = (count) => {
        const step = 1 / count;
        const res = [];
        for (let i = 0; i < count; i++) res.push(step * i);
        return res;
      }
      const rootCircle = { x: 50, y: 50, r: 46.5 };
      const animationItems = split1To(_angles).map((step, i) => ({
        id: getRandomId(),
        deg : startFrom0? 270 : step*360,
        r: fibo? rootCircle.r*(flipedFibo? step : (1 - step)) : rootCircle.r,
        speed: (i+1)*speed,
        color: getRandomColor()
      }));
      const board = {
          width: 100,
          height: 100,
          shapes: [...animationItems],
          staticShapes: [ 
            { hide: true, x:50,y:50,w:15,h:15,isCenterPos:true,text:_angles,style: {fillStyle:'white',textAlign:'center',textBaseline:'middle'} },
            { ...rootCircle, w: rootCircle.r*2, h: rootCircle.r*2, isCenterPos: true, circleDegries: 360, style: { sstrokeStyle: '#ac1b1b', fillStyle: negative? '#FFFFFF20' : '#00000020' } }
          ]
      }
      const canvasService = new CanvasService(board, { selector:  '.animated-loader-container', enableAnimation: true }, (shape, drawOpts, context, service) => {
          const idx = animationItems.findIndex(c => c.id === shape.id);
          const prev = idx === 0? animationItems[animationItems.length-1] : animationItems[idx-1];
          const currPos = MathService.posOnCircleByDeg({...rootCircle, r: shape.r}, shape.deg);
          const prevPos = MathService.posOnCircleByDeg({...rootCircle, r: prev.r}, prev.deg);
          const res = [
              {
                ...currPos,
                circleDegries: 360, w: 6, h: 6, isCenterPos: true, style: { fillStyle: colorize && false? shape.color : '#264e8c' || '#62d667', sstrokeStyle: negative && false? 'white' : 'black' }
              },
          ];
          if (!showAllConnections && (idx || closeShape)) res.push({
            ...currPos,
            zIndex: -1,
            geoShape: [
              { x: 0, y: 0 },
              { x: prevPos.x - currPos.x, y: prevPos.y - currPos.y }
            ],
            style: {
              strokeStyle: colorize && shape.color || ( negative? 'white' : 'black') || '#0f165c' || '#9effb9',
              lineCap: 'round',
              lineWidth: 0.5
            }
          });
          if (showAllConnections) res.push(...animationItems.filter((c, i) => (i > idx) && (c.id !== shape.id) && (closeShape || idx === animationItems.length-1? i : true) && (closeShape || idx || (c.id !== prev.id))).map(c => ({
            ...currPos,
            zIndex: -1,
            geoShape: [
              { x: 0, y: 0 },
              { x: MathService.posOnCircleByDeg({...rootCircle, r: c.r}, c.deg).x - currPos.x, y: MathService.posOnCircleByDeg({...rootCircle, r: c.r}, c.deg).y - currPos.y }
            ],
            style: {
              strokeStyle: colorize && shape.color || ( negative? 'white' : 'black') || '#0f165c' || '#9effb9',
              lineCap: 'round',
              lineWidth: 0.5
            }
          })))
          return res;
      });
      this.destroyCanvas = () => canvasService.removeWindowEventListeners();
      this.animationInterval = setInterval(() => {
        animationItems.forEach(c => {
          c.deg += c.speed;
          const newPos = MathService.posOnCircleByDeg({...rootCircle, r: c.r}, c.deg);
          c.x = newPos.x;
          c.y = newPos.y;
        });
        canvasService.updateCells(animationItems);
      }, 50);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global/index';
.animated-loader-container {
  // height: 200px;
  // width: 200px;
  // border: 2px solid blue;
}
</style>