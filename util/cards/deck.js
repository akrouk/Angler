const { Card } = require('./card');
const { Hand } = require('./hand');
const ranks = require('./ranks'), suits = require('./suits');

/** Class representing a deck of playing cards. */
class Deck {
    /**
     * Constructs a deck of playing cards. The deck is ordered by default. 
     * @param {boolean} hasJokers Boolean that determines whether joker cards are included in the deck or not. False by default.
     */
    constructor(hasJokers = false) {
        this.hasJokers = hasJokers;

        // If deck has jokers, populate it with 2 jokers
        const deck = hasJokers ? [ new Card(ranks.first()), new Card(ranks.first()) ] : [];

        for (const suit of [...suits.values()]) {
            // Slice 1 to skip jokers - handled above 
            for (const rank of [...ranks.values()].slice(1)) {
                deck.push(new Card(rank, suit));
            }
        }

        this.cards = deck;
    }

    /**
     * Shuffles the deck of playing cards.
     * @returns
     */
    shuffle() {
        // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        let i = this.cards.length, r;

        while (i != 0) {
            r = Math.floor(Math.random() * i--);
            [this.cards[i], this.cards[r]] = [this.cards[r], this.cards[i]];
        }

        return this;
    }

    /**
     * Draws a single playing card from the deck.
     * @returns {Card}
     */
    draw() {
        return this.cards.pop();
    }

    /**
     * Draws a number of playing cards from the deck.
     * @param {number} n Number of playing cards to draw. 
     * @returns 
     */
    drawHand(n = 7) {
        return new Hand(this.cards.splice(-n));
    }
}

module.exports = { Deck }