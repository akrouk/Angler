const { SlashCommandBuilder } = require('@discordjs/builders');
const Gamedig = require('gamedig')
const statusEmbed = require('./embeds/status-embed');

const jsonPath = 'commands/data/valheim-server.json';
const errMessage = 'No IP address configured! Use the \`/configure\` command to provide Thjarkur with the IP address of a Valheim server.';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with info about the Valheim server!'),
	async execute(interaction) {
        // Get valheim server JSON data
        const fsPromises = require('fs').promises; 
        const valheimServerBuffer = await fsPromises.readFile(jsonPath);
        const valheimServer = JSON.parse(valheimServerBuffer);

        // Return if IP address is null -- can't check the status unless a server is configured
        if (valheimServer.address === null) {
            await interaction.reply({ content: errMessage, ephemeral: true });
            return;
        }

        // Set the embed's title to optional name (if it exists)
        if (valheimServer.name !== null) {
            statusEmbed.title = valheimServer.name; 
        } else {
            statusEmbed.title = 'Valheim Server'
        }

        // Query server with gamedig -- reply with num of players and ping if online
		Gamedig.query({
            type: 'valheim',
            host: valheimServer.address
        }).then(async (state) => {
            statusEmbed.fields.at(0).value = 'Online';
            statusEmbed.fields.at(1).value = state.raw.numplayers.toString() + '/' + state.maxplayers.toString();
            statusEmbed.fields.at(2).value = state.ping.toString(); 
            await interaction.reply({ embeds: [ statusEmbed ] });
        }).catch(async (error) => {
            console.log('\nStatus was called, but the server was offline.');
            console.log(error);
            statusEmbed.fields.at(0).value = 'Offline';
            statusEmbed.fields.at(1).value = 'N/A';
            statusEmbed.fields.at(2).value = 'N/A';
            await interaction.reply({ embeds: [ statusEmbed ] });
        });
	}
};