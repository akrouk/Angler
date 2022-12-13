
function definePrototypeFunctions() {
    /**
     * Returns a random element from an Array.
     * @returns {any}
     */
    Array.prototype.sample = function() {
        return this[Math.floor(Math.random() * this.length)];
    }
}

module.exports = { definePrototypeFunctions }