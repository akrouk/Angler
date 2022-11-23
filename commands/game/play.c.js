const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const { resolveCommandPath } = require('../../util/cpath');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Start a game of Go Fish!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('singleplayer')
                .setDescription('Start a game of Go Fish against Angler!')
                .addBooleanOption(option =>
                    option
                        .setName('jokers')
                        .setDescription('Whether to play with jokers in the deck or not.')    
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('duel')
                .setDescription('Challenge another user to a game of Go Fish!')
                .addUserOption(option =>
                    option
                        .setName('opponent')
                        .setDescription('The user being challenged to a game of Go Fish.')
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option
                        .setName('jokers')
                        .setDescription('Whether to play with jokers in the deck or not.')    
                )
        ),
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute(interaction) {
        const path = resolveCommandPath(interaction);
		await require(path).execute(interaction);
	}
};