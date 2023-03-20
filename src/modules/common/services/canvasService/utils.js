
export const Utils = {
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
      const m = MathService.slope(pos1, pos2);
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
      
      const slope1 = MathService.slope(...line1);
      const slope2 = MathService.slope(...line2);
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
  isPosOnPoligon (pos = {x: 0, y: 0}, polygon = [], rotate, acordingToPos, debug) {
      const sortLine = (a,b) => a.x-b.x;
      if (rotate) polygon = polygon.map(c => this.rotatePosition(c, rotate));
      if (acordingToPos) polygon = polygon.map(c => ({ x: c.x+acordingToPos.x, y: c.y+acordingToPos.y }));
      const { maxX, maxY, minX, minY } = this.getPolygonSize(polygon);
      if (pos.x < minX || pos.x > maxX || pos.y < minY || pos.y > maxY) return false;
      const testLine = [pos, { x: maxX+1, y: pos.y }].sort(sortLine);
      let intersectPossCount = 0;
      for (let i = 0; i < polygon.length; i++) {
          const currPolLine = [polygon[i], polygon[i+1] || polygon[0]].sort(sortLine);
          if (JSON.stringify(currPolLine[0]) === JSON.stringify(currPolLine[1])) continue;
          const intersectPos = this.isIntersect(testLine, currPolLine);
          if (intersectPos) intersectPossCount++;
      }
      return (intersectPossCount % 2 === 0)? false : true; 
  },
  rotatePosition(pos = { x: 0, y: 0 }, deg = 0, acordingToPos = { x: 0, y: 0 }) {
      const x = pos.x - acordingToPos.x;
      const y = pos.y - acordingToPos.y;
      const rad = MathService.degToRadian(deg);
      return {
          y: (x*Math.sin(rad) + y*Math.cos(rad)) + acordingToPos.y,
          x: (x*Math.cos(rad) - y*Math.sin(rad)) + acordingToPos.x
      }
  },
  isPosInEllipse(pos = { x: 0, y: 0 }, ellipse = { w: 0, y: 0, x: 0, h: 0 }, rotate, acordingToPos) {
      // if (rotate) ellipse
      // if start&end degries - check if in ellipse, and in the rect containes the degried area;
      return ((pos.x-ellipse.x)**2/(ellipse.w/2)) + ((pos.y-ellipse.y)**2/(ellipse.h/2)) <= 1;
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
      const rad = MathService.degToRadian(deg);
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
  }
}

// methods to help with creating the actions elements;
export const ElementService = {
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
