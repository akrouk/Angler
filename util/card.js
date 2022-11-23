
const ranks = {
    joker: { name: "Joker", shorthand: "J" },
    two: { name: "Two", shorthand: "2" },
    three: { name: "Three", shorthand: "3" },
    four: { name: "Four", shorthand: "4" },
    five: { name: "Five", shorthand: "5" },
    six: { name: "Six", shorthand: "6" },
    seven: { name: "Seven", shorthand: "7" },
    eight: { name: "Eight", shorthand: "8" },
    nine: { name: "Nine", shorthand: "9" },
    ten: { name: "Ten", shorthand: "10" },
    jack: { name: "Jack", shorthand: "J" },
    queen: { name: "Queen", shorthand: "Q" },
    king: { name: "King", shorthand: "K" },
    ace: { name: "Ace", shorthand: "A" }
}

const suits = {
    hearts: { name: "Hearts", shorthand: "♡" },
    diamonds: { name: "Diamonds", shorthand: "♢" },
    clubs: { name: "Spades", shorthand: "♤" },
    spades: { name: "Clubs", shorthand: "♧" }
}

class Card {
    /**
     * Constructs a playing card. 
     * @param {{ name: string, shorthand: string }} rank The rank of the card.
     * @param {{ name: string, shorthand: string }} suit The suit of the card.
     */
    constructor(rank, suit = undefined) {
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
     * Converts the playing card to a string representing its rank and suit in shorthand notation.
     * @returns "RS" or "J"
     */
    get shorthand() {
        return this.suit ? `${this.rank.shorthand}${this.suit.shorthand}` : `${this.rank.shorthand}`;
    }

    /**
     * Determines whether the playing card is the provided rank. 
     * @param {string} rank The rank checked against the playing card. 
     * @returns 
     */
    isRank(rank) {
        return this.rank.name === rank;
    }

    /**
     * Determines whether the playing card is the provided suit. 
     * @param {string} suit The suit checked against the playing card. 
     * @returns  
     */
    isSuit(suit) {
        return this.suit.name === suit;
    }
}

module.exports = { Card, ranks, suits }