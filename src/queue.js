import WillBeThereAction from './action.js'

export default class WillBeThereQueue {
	/**
	 * @type {Promise}
	 */
 #queuePromise = null;
 /** 
	* @type {WillBeThereAction[]}
	*/
 #queue = [];
 /**
	* @type {WillBeThereAction}
  */
 #lastAction;
 /**
	* @type {number}
	*/
 #speed = 500;
 /**
	* @type {(boolean)|(()=>boolean)|null}
	*/
 #queueCondition = null;
 #queueIntervalId;
 /**
	* @type {?Function}
	*/
 #onQueueRun;
 /**
	* @type {?Function}
	*/
 #onQueueRan;

 start() {
	 this.stop();
	 this.#queueIntervalId = setInterval(this.#queueInterval.bind(this), this.#speed);
	 return this;
 }

 stop() {
	if (this.#lastAction) {
		this.#lastAction.whenThere = null;
	}
	 if (this.#queueIntervalId) {
		 clearInterval(this.#queueIntervalId);
		 this.#queueIntervalId = undefined;
	 }
	 return this;
 }

 setQueueCondition(condition) {
	 const conditionType = typeof condition;
	 if (conditionType == 'function' && typeof condition() != 'boolean') return console.error('QueueCondition function needs to return a boolean');
	 if (conditionType != 'boolean' && (condition !== null || condition !== undefined)) return console.error('If not a boolean returning function then the condition should be an absolute boolean value');

	 this.#queueCondition = conditionType == 'function'? condition : null;
 }

 willBe(func, params = []) {
	 if (!this.canQueOrRunQue) return;
	 const action = new WillBeThereAction(func, params);
	 this.#queue.push(action);
	 return this;
 }

 #queueInterval() {
	 if (!this.canQueOrRunQue || this.isQueueEmpty) return;
	 let start = true;
	 if (this.#lastAction) {
		 this.#lastAction.whenThere = null;
	 }
	 while (this.#queue.length) {
		 if (start) {
			this.#onQueueRun?.();
			 start = false;
		 }
		 const action = this.#queue.shift();
		 this.#lastAction = action;
		 if (!this.#queuePromise) {
			 this.#queuePromise = action.run();
		 } else {
			 this.#queuePromise = this.#queuePromise.then(() => action.run());
		 }
	 }
	 this.#lastAction.whenThere = () => {
		 this.#onQueueRan?.();
		 this.#lastAction = null;
	 };
 }

 set onQueueRun(value) {
	 this.#onQueueRun = typeof value == 'function' ? value : undefined;
 }
 get onQueueRun() {
	 return this.#onQueueRun;
 }

 set onQueueRan(value) {
	 this.#onQueueRan = typeof value == 'function' ? value : undefined;
 }
 get onQueueRan() {
	 return this.#onQueueRan;
 }

 get canQueOrRunQue() {
	 if (this.#queueCondition === null) return true;
	 if (typeof this.#queueCondition == 'function') return this.#queueCondition();
	 return this.#queueCondition;
 }

 get queueSize() {
	 return this.#queue.length;
 }

 get isQueueEmpty() {
	 return this.#queue.length == 0;
 }
 
 set speed(value) {
	 if (Number.isFinite(value)) {
		 this.#speed = Math.floor(value * 1000);
	 }
 }
 get speed() {
	 return this.#speed / 1000
 }
 set speedMs(value) {
	 if (Number.isFinite(value)) {
		 this.#speed = value;
	 }
 }
 get speedMs() {
	 return this.#speed;
 }
}
