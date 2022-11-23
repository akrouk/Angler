const { Card, ranks, suits } = require('./card');

/** Class representing a deck of playing cards. */
class Deck {
    /**
     * Constructs a deck of playing cards. The deck is ordered by default. 
     * @param {boolean} hasJokers Boolean that determines whether joker cards are included in the deck or not. False by default.
     */
    constructor(hasJokers = false) {
        this.hasJokers = hasJokers;

        const deck = hasJokers ? [ new Card(ranks.joker), new Card(ranks.joker) ] : [];

        for (const s in suits) {
            for (const r in ranks) {
                if (ranks[r].name === ranks.joker.name) continue;
                deck.push(new Card(ranks[r], suits[s]));
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
     * @param {string} delimiter Delimiter used to separate the values in the names and shorthand strings.
     * @returns 
     */
    drawHand(n, delimiter = '\n') {
        const cards = this.cards.splice(-n);
        let names = "", shorthand = "", i = cards.length;

        const concat = (a, b = undefined) => {
            names += a;
            shorthand += b ?? a;
        }

        for (const card of cards) {
            concat(card.name, card.shorthand);
            if (--i) concat(delimiter);
        }

        return { cards, names, shorthand };
    }
}

module.exports = { Deck }