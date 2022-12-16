
function definePrototypeFunctions() {
    /**
     * Returns a random element from an Array.
     * @returns 
     */
    Array.prototype.sample = function() {
        return this[Math.floor(Math.random() * this.length)];
    }

    /**
     * Returns a set of the array, i.e., a copy with no duplicate elements.
     * @returns 
     */
    Array.prototype.set = function() {
        return [...new Set(this)];
    }
}

module.exports = { definePrototypeFunctions }