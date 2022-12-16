const ranks = require('./ranks'), suits = require('./suits');

class InvalidRank extends Error {
    /**
     * @param {string} rank 
     */
    constructor(rank) {
        super(`No such rank: ${rank}.`);
        this.name = 'InvalidRank';
    }
}

class InvalidSuit extends Error {
    /**
     * @param {string} suit 
     */
    constructor(suit) {
        super(`No such suit: ${suit}.`);
        this.name = 'InvalidSuit';
    }
}

class Card {
    /**
     * Constructs a playing card. The suit is undefined if the playing card is a Joker.
     * @param {{ name: string, shorthand: string, emoji: string, weight: number }} rank The rank of the card.
     * @param {{ name: string, shorthand: string, emoji: string }} suit The suit of the card.
     */
    constructor(rank, suit = undefined) {
        if (!ranks.has(rank.name.toLowerCase())) {
            throw new InvalidRank(rank.name);
        }

        if (suit && !suits.has(suit.name.toLowerCase())) {
            throw new InvalidSuit(suit.name);
        }

        this.rank = rank;
        this.suit = suit;
    }

    /**
     * Converts the playing card to a string representing its rank and suit.
     * @returns "Rank of Suit" or "Joker"
     */
    get name() {
        return this.suit ? `${this.rank.name} of ${this.suit.name}` : `${this.rank.name}`;
    }

    /**
     * Converts the playing card to a string representing its rank.
     * @returns
     */
    get rankName() {
        return `${this.rank.name}`;
    }

    get rankWeight() {
        return this.rank.weight;
    }

    /**
     * Converts the playing card to a string representing its rank and suit in shorthand notation.
     * @returns "RS" or "J"
     */
    get shorthand() {
        return this.suit ? `${this.rank.shorthand}${this.suit.shorthand}` : `${this.rank.shorthand}`;
    }

    /**
     * Converts the playing card's emoji to a Discord API emoji component.
     * @returns
     */
    get emojiComponent() {
        return { name: this.emoji };
    }
}

module.exports = { Card }