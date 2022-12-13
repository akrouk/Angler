const { Card } = require('./card');

/** Class representing a hand of playing cards. */
class Hand {
    /**
     * Constructs a hand of playing cards.
     * @param {Card[]} cards 
     */
    constructor(cards) {
        this.cards = cards;
        this.#sortHand();
    }

    /**
     * Sorts the cards in the hand.
     */
    #sortHand() {
        this.cards.sort((a, b) => a.rankWeight - b.rankWeight);
    }

    /**
     * Returns an array of card names in the hand.
     * @returns
     */
    get names() {
        return this.cards.map(card => card.name);
    }

    /**
     * Returns an array of shorthand card names in the hand.
     * @returns
     */
    get shorthand() {
        return this.cards.map(card => card.shorthand);
    }

    /**
     * Returns an array of all distinct ranks in the hand.
     * @returns
     */
    get ranks() {
        return [...new Set(this.cards.map(card => card.rankName))];
    }
}

module.exports = { Hand }