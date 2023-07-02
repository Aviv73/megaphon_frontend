export class EventEmiter {
  Events = {};

  on = (eventName, cb) => {
      if (!this.Events[eventName]) this.Events[eventName] = [];
      this.Events[eventName].push(cb);
      return () => this.off(eventName, cb);
  }

  off = (eventName, cb) => {
      if (!cb) {
          delete this.Events[eventName];
          return;
      }
      var idx = this.Events[eventName].findIndex(curr => curr === cb);
      if (idx === -1) return;
      this.Events[eventName].splice(idx, 1);
  }

  emit = (eventName, ...args) => {
      if (!this.Events[eventName]) return;
      this.Events[eventName].forEach(curr => curr(...args));
  }
}

export default new EventEmiter();