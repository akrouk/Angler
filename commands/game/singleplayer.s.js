const { CommandInteraction, Message } = require('discord.js');
const { Deck, Hand } = require('../../util/cards');
const { goFish, playerTurn, botUpdates, updates } = require('../../util/gameplay');

/**
 * @param {Hand} hand 
 * @param {string} description
 * @returns
 */
const board = (hand, description) => [{
    color: hand.owner.accentColor,
    description,
    author: {
        name: hand.owner.username,
        icon_url: hand.owner.avatarURL()
    },
    fields: [
        {
            name: 'Books',
            value: 'None'
        },
        {
            name: 'Hand',
            value: hand.shorthand.join(' | ')
        }
    ]
}];

module.exports = {
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const hasJokers = interaction.options.getBoolean('jokers');
        const deck = new Deck(hasJokers).shuffle();

        // Force fetch user (to access their accent color)
        const player = await interaction.user.fetch(true);

        const playerHand = deck.drawHand(player);
        const botHand = deck.drawHand(interaction.client.user);

        await interaction.reply('Game starting!');

        // Store player/bot replies so they can be edited during gameplay
        // I.e., use as the game board
        const botMessage = await interaction.followUp({
            embeds: board(botHand, updates.bot.start)
        });

        const playerMessage = await interaction.followUp({
            embeds: board(playerHand, updates.player.start('first'))
        });

        /**
         * @param {'player'|'bot'} user 
         * @param {string} update 
         * @returns 
         */
        const updateBoard = async (user, update) => user === 'player' 
            ? await playerMessage.edit({ embeds: board(playerHand, update) })
            : await botMessage.edit({ embeds: board(botHand, update) });

        while (deck.cards.length > 0) {
            const rank = await playerTurn({ 
                userId: interaction.user.id,
                hand: playerHand,
                message: playerMessage
            });
            
            let newCards = botHand.give(playerHand, rank), from;
            await updateBoard('bot', updates.bot.response(newCards));

            if (newCards.length > 0) {
                from = botHand.owner;
            } else {
                newCards.push(...await goFish({
                    userId: interaction.user.id,
                    hand: playerHand,
                    deck,
                    message: playerMessage,
                }));

                // No more cards in deck
                if (newCards.length === 0) break;
            }

            const playerTurnUpdates = [ updates.player.drew(newCards, from) ];

            // If player had to go fish and drew the rank they selected, show it to the bot
            if (!from && rank === newCards[0].rankName) {
                playerTurnUpdates.push(updates.player.desiredRank(botHand.owner));
            }
            
            await updateBoard('player', playerTurnUpdates.join('\n'));
        }

        return await interaction.followUp('Game over!');
    }
}