import Action from './action.js';
import Queue from './queue.js';

export default function willBe() {
	return new Queue()
};

export {
	Queue,
	Action
}