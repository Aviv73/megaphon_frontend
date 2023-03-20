function flipItem(item = {}, debug) {
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
      // if (res.degries) {
      //     res.degries = res.degries.map(c => fixAng(c - (res.degries[0] - res.degries[1])));
      // }
      res.scale[0] *= -1;
      
      reducedX = (res.x + (item.isCenterPos? 0 : res.w));
      // reducedY = (res.y + (item.isCenterPos? 0 : res.h));
  }
  if (isMirrorY) {
      res.y = (bySize.h - reducedY);
      res.rotate = fixAng(180+(180-res.rotate));
      // if (res.degries) {
      //     res.degries = res.degries.map(c => fixAng(c - (res.degries[0] - res.degries[1])));
      // }
      res.scale[1] *= -1;

      reducedY = (res.y + (item.isCenterPos? 0 : res.h));
  }
  switch (level) {
      case 1:
          break; 
      case 3:
          res.y = (bySize.h - reducedY);
          res.x = (bySize.w - reducedX);
          res.rotate = fixAng(res.rotate - 180);
          if (res.degries) {
              res.degries = res.degries.map(c => fixAng((c - (res.degries[0] - res.degries[1])))) ;
          }

      break; case 2:
          res.y = x;
          res.x = bySize.w - reducedY;
          res.rotate = fixAng(res.rotate - 270);
      break; case 4:
          res.y = bySize.h - reducedX;
          res.x = reducedY;
          res.rotate = fixAng(res.rotate - 90);
  }
  return res;
}
  
function updateFlipLevel(val = 1, exact = false) {
  if (exact) this.flipLevel = val;
  else this.flipLevel += val;
  this.init();
}
function flipLevelSetter(level) {
  if (![1, 2, 3, 4].includes(level)) level = 1;
  this. _flipLevel = level;
}
function flipLevelGetter() {
  return this._flipLevel || 1;
}

function toggleMirrorX(val) {
  if (typeof val === 'boolean') this.isMirrorX = val;
  else this.isMirrorX = !this.isMirrorX;
  this.init();
}
function toggleMirrorY(val) {
  if (typeof val === 'boolean') this.isMirrorY = val;
  else this.isMirrorY = !this.isMirrorY;
  this.init();
}

function isSizeFlipped() {
  return [2,4].includes(this.flipLevel);
}

export default {
  flipItem,
  updateFlipLevel,
  flipLevelSetter,
  flipLevelGetter,
  toggleMirrorX,
  toggleMirrorY,
  isSizeFlipped
}