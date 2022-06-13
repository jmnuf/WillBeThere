export default class WillBeThereAction {
	/**
	 * @type {Function}
	 */
	#func;
	/**
	 * @type {Array}
	 */
	#params;
	
	#madeItThere = false;
	#workingOnIt = false;
	/**
	 * @type {Promise}
	 */
	#promise;
	/**
	 * @type {?Function}
	 */
	#whenYouGetThere;

	constructor(func, params) {
		if (typeof func != 'function')
			throw TypeError('Expected a function as the first parameter for a WillBeThere');
		if (!Array.isArray(params))
			throw TypeError('Expected an array for the second parameter for a WillBeThere');
		this.#func = func;
		this.#params = params;
	}

	async run() {
		if (this.#promise) return await this.#promise;
		this.#madeItThere = false;
		this.#workingOnIt = true;
		this.#promise = new Promise(resolve => {
			Promise.resolve(this.#func(...this.#params))
				.catch(console.error)
				.finally(() => {
					this.#workingOnIt = false;
					this.#madeItThere = true;
					if (this.#whenYouGetThere) this.#whenYouGetThere()
					this.#promise = null;
					resolve()
				})
		});
		return await this.#promise;
	}

	set whenThere(value) {
		if (typeof value == 'function' || value === null) {
			this.#whenYouGetThere = value
		}
	}
	get whenThere() {
		return this.#whenYouGetThere;
	}

	get isThere() {
		return this.#madeItThere
	}

	get isGettingThere() {
		return this.#workingOnIt;
	}
}
