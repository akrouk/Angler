const { SlashCommandBuilder } = require('@discordjs/builders');
const Gamedig = require('gamedig')
const statusEmbed = require('./embeds/status-embed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with info about the Valheim server!'),
	async execute(interaction) {
		Gamedig.query({
            type: 'valheim',
            host: '10.20.0.229'
        }).then((state) => {
            statusEmbed.fields.at(0).value = 'Online';
            statusEmbed.fields.at(1).value = state.raw.numplayers.toString() + '/64';
            statusEmbed.fields.at(2).value = state.ping.toString(); 
            interaction.reply({ embeds: [ statusEmbed ] });
        }).catch((error) => {
            console.log('\nStatus was called, but the server was offline.');
            console.log(error);

            statusEmbed.fields.at(0).value = 'Offline';
            statusEmbed.fields.at(1).value = 'N/A';
            statusEmbed.fields.at(2).value = 'N/A';
            interaction.reply({ embeds: [ statusEmbed ] });
        })
	}
};