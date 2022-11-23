const { CommandInteraction } = require('discord.js');

module.exports = {
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        return interaction.reply('Duel, good choice!');
    }
}