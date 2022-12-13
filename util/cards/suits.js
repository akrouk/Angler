const { Collection } = require('discord.js');

/** Playing card suits. */
module.exports = new Collection([
    [ 'hearts', { name: 'Hearts', shorthand: '♡', emoji: '♥️' } ],
    [ 'diamonds', { name: 'Diamonds', shorthand: '♢', emoji: '♦️' } ],
    [ 'spades', { name: 'Spades', shorthand: '♤', emoji: '♠️' } ],
    [ 'clubs', { name: 'Clubs', shorthand: '♧', emoji: '♣️' } ]
]);