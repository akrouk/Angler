const { User } = require('discord.js');
const { Card } = require('./card');
const { Counter } = require('../general/counter');

/** Class representing a hand of playing cards. */
class Hand {
    /** @type {Map<string, Card[]>} */
    #books = new Map();

    /**
     * Constructs a hand of playing cards.
     * @param {User} owner
     * @param {Card[]} cards 
     */
    constructor(owner, cards) {
        this.owner = owner;
        this.cards = cards;
        this.sort();
    }

    /**
     * Returns the number of cards in the hand.
     * @returns
     */
    get length() {
        return this.cards.length;
    }

    /**
     * Returns the number of books formed in this hand.
     * @returns
     */
    get bookCount() {
        return this.#books.size > 0 ? this.#books.size.toString() : 'None';
    }

    /**
     * Returns an array of card names in the hand.
     * @returns
     */
    get names() {
        return this.length > 0 ? this.cards.map(card => card.name) : [ 'None' ];
    }

    /**
     * Returns an array of shorthand card names in the hand.
     * @returns
     */
    get shorthand() {
        return this.length > 0 ? this.cards.map(card => card.shorthand) : [ 'None' ];
    }

    /**
     * Returns an array of all distinct ranks in the hand.
     * @returns 
     */
    get ranks() {
        return [...new Set(this.cards.map(card => card.rankName))];
    }

    /**
     * Sorts the cards in the hand.
     */
    sort() {
        this.cards.sort((a, b) => a.rankWeight - b.rankWeight);
    }

    /**
     * Converts hand to a string of cards in shorthand notation.
     * @param {boolean} visible 
     */
    shorthandString(visible = true) {
        if (visible) return this.shorthand.join(' | ');

        const hiddenHand = this.cards
            .filter(card => card.known)
            .map(card => card.shorthand);

        hiddenHand.push(...Array(this.cards.length - hiddenHand.length).fill('??'));
        return hiddenHand.join(' | ');
    }

    /**
     * Adds playing cards to the hand.
     * @param {Card|Card[]} cards
     * @returns
     */
    add(cards) {
        if (!(cards instanceof Array)) cards = [ cards ];
        return (this.cards.push(...cards), this.sort(), cards);
    }

    /**
     * Finds a book and adds it to the hand.
     * @returns
     */
    addBook() {
        /** @type {Map<string, Card>} */
        let counts = new Counter(this.cards, card => card.rankName);
        
        for (const rank of counts.keys()) {
            if (counts.get(rank) < 4) continue;

            const index = this.cards.findIndex(card => card.rankName === rank);
            const cards = this.cards.splice(index, 4);

            return (this.#books.set(rank, cards), { rank, cards });
        }
    }

    /**
     * Gives cards of a certain rank to another hand.
     * @param {Hand} hand 
     * @param {string} rank 
     * @returns 
     */
    give(hand, rank) {
        // Index and count of cards in the hand matching rank param
        const index = this.cards.findIndex(card => card.rankName === rank);
        const count = this.cards.filter(card => card.rankName === rank).length;

        let exchangedCards = undefined;

        // If cards of matching rank param were found
        if (index >= 0) {
            // Exchange cards in this hand with other hand
            exchangedCards = this.cards.splice(index, count);
            exchangedCards.forEach(card => card.known = true);
            hand.cards.push(...exchangedCards);

            // Sort both hands
            this.sort(), hand.sort();
        }

        return exchangedCards ?? [];
    }
}

module.exports = { Hand }