
function definePrototypeFunctions() {
    Array.prototype.sample = function() {
        return this[Math.floor(Math.random() * this.length)];
    }
}

module.exports = { definePrototypeFunctions }