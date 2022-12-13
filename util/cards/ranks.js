const { Collection } = require('discord.js');
const emojis = require('../../emojis.json');

/** Playing card ranks, including joker. */
module.exports = new Collection([
    [ 'joker', { name: 'Joker', shorthand: 'J', weight: 1 } ],
    [ 'two', { name: 'Two', shorthand: '2', weight: 2 } ],
    [ 'three', { name: 'Three', shorthand: '3', weight: 3 } ],
    [ 'four', { name: 'Four', shorthand: '4', weight: 4 } ],
    [ 'five', { name: 'Five', shorthand: '5', weight: 5 } ],
    [ 'six', { name: 'Six', shorthand: '6', weight: 6 } ],
    [ 'seven', { name: 'Seven', shorthand: '7', weight: 7 } ],
    [ 'eight', { name: 'Eight', shorthand: '8', weight: 8 } ],
    [ 'nine', { name: 'Nine', shorthand: '9', weight: 9 } ],
    [ 'ten', { name: 'Ten', shorthand: '10', weight: 10 } ],
    [ 'jack', { name: 'Jack', shorthand: 'J', weight: 11 } ],
    [ 'queen', { name: 'Queen', shorthand: 'Q', weight: 12 } ],
    [ 'king', { name: 'King', shorthand: 'K', weight: 13 } ],
    [ 'ace', { name: 'Ace', shorthand: 'A', emoji: emojis.ace, weight: 14 } ]
]); 
