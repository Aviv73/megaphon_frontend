/**
 * TaskManager
 * 
 * The role of this file is to manage asynchronic tasks in a q;
 * Sometimes we know that some asynchronic actions might fail, even if our code is fine.
 * depending on a third party tools or outsource servers might couse problems that not necesarly depends on our code.
 * Therfore this TaskManager service knows to try and execute these tasks multiple times until it succeeds.
 * 
 * When creating new TaskManager item you need to give the constructor a callback that runs when a task is being executed.
 * this CB is the function thet recives the task data and handles it. it might be called multiple times with each data;
 * 
 * the method appendTask gets data that will be sent to the executeCB function.
 * the method adds the given data to the tasks q.
 * whenever a task is done it will resolve its promise, if it failed the maximum attempts, it will reject the specific task;
 * 
 * if the constructor is being initted with maxAttempts 0/null it will try to execute the task unlimitted times until success;
 * 
 * for example:
 * const executeCb = (someTaskData) => { // handleTask };
 * const maxAttempts = 5;
 * const tasker = new TaskManager(executeCb, maxAttempts);
 * await tasker.appendTask({ msg: 'some task', id: 1 });
 * const allTasks = tasker.tasksAsArray; // maybe use to render or whatever;
 * // do whatever after this task is done
*/

// class TaskManager {
export class TaskManager {
  Tasks = {
    pending: [],
    failed: [],
    success: [],
    process: []
  };
  Errors = []
  IsInProcess = false;
  Interval = null;
  nextTaskId = 1;
  // currInProcessCount = 0;
  constructor(executeCb = () => {}, maxAttempts = 10, maxParrallelAttempts = 10, onTaskFailCb = (errItem) => {}, initTaskData = { pending: [], failed: [], success: [], process: [] }) {
    this.execute = executeCb;
    this.maxAttempts = maxAttempts;
    this.maxParrallelAttempts = maxParrallelAttempts;
    this.intervalMode = false;
    this.Tasks = initTaskData;
    this.onTaskFail = onTaskFailCb;
    this.runTasks();
  }

  static executeSingleTask(executeCB, maxAttempts) {
    const tasker = new TaskManager(executeCB, maxAttempts);
    return tasker.appendTask();;
  }

  get posibleFail() {
    return !!this.maxAttempts;
  }

  get tasksAsArray() {
    const tasksToView = Object.keys(this.Tasks).reduce((acc, status) => {
      acc.push(...this.Tasks[status].map((c) => ({...c, status})));
      return acc;
    }, []);
    tasksToView.sort((a, b) => a.createdAt - b.createdAt);
    return tasksToView;
  }

  get allData() {
    const { Tasks, Errors } = this;
    return { Tasks, Errors };
  }

  get canExecuteMoreTasks() {
    // return this.currInProcessCount < this.maxParrallelAttempts;
    return this.Tasks.process.length < this.maxParrallelAttempts;
  }

  appendTask = (taskData, itsIdx = null) => {
    const task = this.createTaskItem(taskData, itsIdx);
    this.Tasks.pending.push(task);

    this.runTasks();

    return task.prm.promise;
  }
  appendTasks = (taskDatas = []) => {
    return Promise.all(taskDatas.map(c => this.appendTask(c)));
  }

  runTasks = () => {
    if (this.intervalMode) this.playTaskInterval();
    // else if (!this.IsInProcess) this.doExecuteTaskFromQ();
    else if (this.canExecuteMoreTasks) this.doExecuteMultipleTasksFromQ();
  }

  doExecuteMultipleTasksFromQ = async () => {
    // const canExecuteCount = this.maxParrallelAttempts - this.currInProcessCount;
    const canExecuteCount = this.maxParrallelAttempts - this.Tasks.process.length;
    if (canExecuteCount <= 0) return;
    for (let i = 0; i < canExecuteCount; i ++) {
      await this.tryExecuteTask();
      const hasMoreToDo = !!this.Tasks.pending.length;
      if (hasMoreToDo) this.doExecuteMultipleTasksFromQ();
      // if (hasMoreToDo) setTimeout(() => this.doExecuteMultipleTasksFromQ(), 1);
    }
  }

  doExecuteTaskFromQ = async () => {
    this.IsInProcess = true;
    await this.tryExecuteTask();
    const hasMoreToDo = !!this.Tasks.pending.length;
    if (hasMoreToDo) this.doExecuteTaskFromQ();
    // if (hasMoreToDo) setTimeout(() => this.doExecuteTaskFromQ(), 1);
    else this.IsInProcess = false;
  }

  playTaskInterval() {
    if (this.Interval) return;
    if (!this.Tasks.pending?.length) return;
    setInterval(() => {
      if (!this.Tasks.pending?.length) return this.stopTaskInterval();
      this.tryExecuteTask();
    }, 10);
  }
  stopTaskInterval() {
    clearInterval(this.Interval);
    this.Interval = null;
  }

  tryExecuteTask = async () => {
    if (!this.canExecuteMoreTasks) return;
    if (!this.Tasks.pending?.length) return;
    const task = this.Tasks.pending.shift();
    this.Tasks.process.push(task);
    task.lastAttemptAt = Date.now();
    task.attemptsCount++;
    try {
      // this.currInProcessCount++;
      if (task.isCbMode) await task.cb();
      else await this.execute(task.data, task.itsIdx);
      task.doneAt = Date.now();
      this.Tasks.success.push(task);
      task.prm?.resolve?.(this.taskToResolve(task));
    } catch(err) {
      const errorMsg = err?.stack?.toString?.() || err?.msg || err?.message || err || 'UNKNOWN';
      const errorItem = { error:  errorMsg , taskId: task.id, at: Date.now() };
      this.Errors.push();
      console.log('TASK_MANAGER_ERROR: FAILED TO RUN TASK || ' + task.id);
      console.error(errorMsg);
      if (this.onTaskFail) this.onTaskFail(errorItem);
      if (this.posibleFail && (task.attemptsCount >= this.maxAttempts)) {
        task.error = `Faild after max attempts | Error: ${errorMsg}`;
        this.Tasks.failed.push(task);
        task.prm?.reject?.(this.taskToResolve(task));
      }
      else this.Tasks.pending.push(task);
    } finally {
    }
    const idx = this.Tasks.process.findIndex(c => c.id === task.id);
    this.Tasks.process.splice(idx, 1);
    // this.currInProcessCount--;
  }

  createTaskItem(data = {}, itsIdx = null) {
    let prm = {};
    const promise = new Promise((resolve, reject) => {
      prm = { resolve, reject }
    });
    const isCbMode = typeof data === 'function';
    return {
      data: isCbMode ? null : data,
      cb: isCbMode ? data : null,
      itsIdx,
      id: this.nextTaskId++,
      createdAt: Date.now(),
      lastAttemptAt: null,
      doneAt: null,
      attemptsCount: 0,
      prm: { ...prm, promise },
      isCbMode
    }
  }
  taskToResolve(task) {
    const taskErrors = this.Errors.filter(e => e.taskId === task.id);
    return {...task, errors: taskErrors};
  }
}
  
// module.exports = { TaskManager }