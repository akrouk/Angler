const { SlashCommandBuilder } = require('@discordjs/builders');
const { Deck } = require('../../util/deck');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping Angler!'),
	async execute(interaction) {
		await interaction.reply([ '🐟', '🎣', '🐠', '🐡', '🦈', '🐋', '🐬', '🐳', '🐚', '🦀', '🐙', '🦑', '🦞', '🦐' ].sample());
	}
};