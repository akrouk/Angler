const { CommandInteraction, Message } = require('discord.js');
const { Deck, Hand } = require('../../util/cards');
const { goFish, playerTurn, botUpdates, updates } = require('../../util/gameplay');

/**
 * @param {Hand} hand 
 * @param {string} description
 * @param {boolean} showHand
 * @returns
 */
const board = (hand, description, showHand) => [{
    color: hand.owner.accentColor,
    description,
    author: {
        name: hand.owner.username,
        icon_url: hand.owner.avatarURL()
    },
    fields: [
        {
            name: 'Books',
            value: hand.bookCount
        },
        {
            name: 'Hand',
            value: hand.shorthandString(showHand)
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
            embeds: board(botHand, updates.bot.start, false)
        });

        const playerMessage = await interaction.followUp({
            embeds: board(playerHand, updates.player.start('first'), true)
        });

        /**
         * @param {'player'|'bot'} user 
         * @param {string} update 
         * @returns 
         */
        const updateBoard = async (user, update) => user === 'player' 
            ? await playerMessage.edit({ embeds: board(playerHand, update, true) })
            : await botMessage.edit({ embeds: board(botHand, update, false) });

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
                    desiredRank: rank,
                    hand: playerHand,
                    deck,
                    message: playerMessage,
                }));

                // No more cards in deck
                if (newCards.length === 0) break;
            }

            const playerTurnUpdates = [ updates.player.drew(newCards, from) ];

            // If player had to go fish and drew the rank they selected, show it to the bot
            if (!from && newCards[0].known) {
                playerTurnUpdates.push(updates.player.desiredRank(botHand.owner));
            }

            const book = playerHand.addBook();

            if (book) {
                playerTurnUpdates.push(updates.player.formedBook(book.rank));
            }
            
            await updateBoard('player', playerTurnUpdates.join('\n'));
        }

        return await interaction.followUp('Game over!');
    }
}