const { Collection, User } = require('discord.js');
const { Card } = require('./card');

/** Class representing a hand of playing cards. */
class Hand {
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

    /**
     * Sorts the cards in the hand.
     */
    sort() {
        this.cards.sort((a, b) => a.rankWeight - b.rankWeight);
    }

    /**
     * Adds playing cards to the hand.
     * @param {Card|Card[]} cards
     * @returns
     */
    add(cards) {
        cards instanceof Array ? this.cards.push(...cards) : this.cards.push(cards);
        this.sort();
        return [ cards ].flat();
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
            hand.cards.push(...exchangedCards);

            // Sort both hands
            this.sort(), hand.sort();
        }

        return exchangedCards ?? [];
    }
}

module.exports = { Hand }