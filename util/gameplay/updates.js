const { bold, userMention } = require('@discordjs/builders');
const { User } = require('discord.js');
const { Card } = require('../cards');

/**
 * @param {string} rank 
 */
const plural = rank => rank.at(-1) === 'x' ? rank + 'es' : rank + 's';

const updates = {
    bot: {
        start: 'Ready when you are!',

        /**
         * @param {Card[]} cardsAdded
         * @returns
         */
        response: cards => {
            switch (cards.length) {
                case 0:
                    return 'Go fish!';
                case 1:
                    return 'No, my card!';
                default:
                    return 'No, my cards!';
            }
        }
    },

    player: {
        /**
         * @param {'first'|'second'} order 
         * @returns 
         */
        start: order => order === 'first' ? 'You\'re up first!' : 'You\'re up next, get ready!',

        /**
         * @param {Card[]} cards 
         * @param {User} from 
         * @returns 
         */
        drew: (cards, from = undefined) => {
            if (cards.length === 0) return 'You drew nothing.';

            const names = cards.map(card => bold(card.name));

            const namesList = names.length < 3 
                ? `the ${names.join(' and the ')}` 
                : `the ${names.slice(0, -1).join(', the ')}, and the ${names.at(-1)}`;

            return from 
                ? `You got ${namesList} from ${userMention(from.id)}!` 
                : `You drew ${namesList}.`;
        },

        /**
         * @param {User} opponent 
         */
        desiredRank: opponent => `You show it to ${userMention(opponent.id)}.`,

        /**
         * @param {string} rank 
         */
        formedBook: rank => `You formed a book of ${bold(plural(rank))}!`
    }
}

module.exports = { updates }