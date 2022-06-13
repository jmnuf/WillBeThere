import willBe from '../src/index.js';

function get(id) {
	return document.querySelector(`#${id}`);
}
function getItems() {
	return [...document.querySelectorAll('.item')];
}

function setHighlight(item, on) {
	item.classList.toggle('highlight', on);
}
function turnHigh(item) {
	setHighlight(item, true);
}
function clearHigh(item) {
	setHighlight(item, false);
}
function delay(func, ms) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(func());
		}, ms);
	})
}
function delayed(func, time = 1000, isSeconds = false) {
	const ms = isSeconds ? secToMs(time) : time
	return () => {
		return delay(func, ms)
	}
}
function msToSec(ms) {
	return ms / 1000;
}
function secToMs(sec) {
	return sec * 1000;
}
function createSequence(item) {
	return delayed(() => turnHigh(item));
	// return () => {
	// 	return new Promise(resolve => {
	// 		setTimeout(() => {
	// 			turnHigh(item);
	// 			resolve();
	// 		}, 1000);
	// 	});
	// };
}
function reversedSequence(item) {
	return delayed(() => clearHigh(item))
}
function onQueueRun() {
	console.log('Checking queued items...');
}

const there = willBe();
there.start();
there.onQueueRun = onQueueRun;

const startBtn = get('start-btn');
const progress = get('progress-span');

startBtn.addEventListener('click', () => {
	progress.innerHTML = 'Actions added to queue<br>Playing action sequence 1...';
	startBtn.textContent = 'Playing';
	startBtn.disabled = true;
	const items = getItems();
	items.forEach(item => there.willBe(createSequence(item)));
	there.onQueueRan = () => {
		const SECONDS_DELAY = 2;
		progress.innerHTML = 'Action sequence 1 completed!<br>Will start sequence 2 in a moment...';
		console.log(`Queue has been cleared. Will repopulating with actions in ${SECONDS_DELAY}s...`);
		delay(() => {
			there.onQueueRun = () => {
				progress.innerHTML = 'Action sequence 1 completed!<br>Playing action sequence 2...';
				onQueueRun();
				there.onQueueRun = onQueueRun;
			};
			there.onQueueRan = () => {
				startBtn.disabled = false;
				progress.innerHTML = 'Action sequences 1 and 2 completed!<br>Waiting to replay...';
				console.log('Queue has been cleared');
				there.onQueueRan = null;
				startBtn.textContent = 'Re-Play';
			};
			items.reverse().forEach(item => there.willBe(reversedSequence(item)));
		}, secToMs(SECONDS_DELAY));
	};
});

progress.innerHTML = 'WillBeThere has been loaded and setup<br>Waiting to start...';
startBtn.disabled = false;
startBtn.textContent = 'Play';
