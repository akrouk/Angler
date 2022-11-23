const { CommandInteraction, MessageEmbed } = require('discord.js');
const { Deck } = require('../../util/deck');

module.exports = {
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const hasJokers = interaction.options.getBoolean('jokers');

        const deck = new Deck(hasJokers).shuffle();
        const playerHand = deck.drawHand(7), botHand = deck.drawHand(7);

        const embed = new MessageEmbed()
            .setTitle('Hand')
            .setDescription(playerHand.shorthand);

        return interaction.reply({ embeds: [ embed ] });
    }
}