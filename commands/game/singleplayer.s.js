const { CommandInteraction, EmbedBuilder } = require('discord.js');
const { Deck, selectRank } = require('../../util/cards');

module.exports = {
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const hasJokers = interaction.options.getBoolean('jokers');

        const deck = new Deck(hasJokers).shuffle();
        const playerHand = deck.drawHand(), botHand = deck.drawHand();

        const embed = new EmbedBuilder()
            .setTitle('Hand')
            .setDescription(playerHand.shorthand.join(' | '));

        const selectRankOptions = { 
            hand: playerHand,
            interaction, 
            replyOptions: { embeds: [ embed ] }
        };

        const selectedRank = await selectRank(selectRankOptions);
        return await interaction.followUp(selectedRank ?? 'None');
    }
}