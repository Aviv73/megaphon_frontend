function addWindowEventListener(evName, cb) {
  if (!this.windowEvsMap[evName]) this.windowEvsMap[evName] = [];
  this.windowEvsMap[evName].push(cb);
  window.addEventListener(evName, cb);
}
function removeWindowEventListeners() {
  const { windowEvsMap } = this;
  for (let evName in windowEvsMap) {
      const cbs = windowEvsMap[evName];
      cbs.forEach(cb => window.removeEventListener(evName, cb));
  }
  this.resizeObserver.unobserve(this.elParent);
  this.resizeObserver.disconnect();
  Object.values(this.intervals).forEach(clearInterval);
}

function setResizeEvents() {
  // this.elParent.addEventListener('resize', this.resizeDebouncebind(this));
  this.resizeObserver = new ResizeObserver(this.init.bind(this));
  this.resizeObserver.observe(this.elParent);
}


export default {
  addWindowEventListener,
  removeWindowEventListeners,
  setResizeEvents
}