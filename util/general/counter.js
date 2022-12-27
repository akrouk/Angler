// Modified from: https://stackoverflow.com/questions/17313268/idiomatically-find-the-number-of-occurrences-a-given-value-has-in-an-array

class Counter extends Map {
    /**
     * @param {Iterable} iterable 
     * @param {Function} map 
     */
    constructor(iterable, map = undefined) {
        super();
        this.map = map || (element => element);
        
        for (let element of iterable) {
            this.add(element);
        }
    }

    /**
     * @param {any} element
     */
    add(element) {
        element = this.map(element);
        this.set(element, (this.get(element) || 0) + 1);
    }
}

module.exports = { Counter }