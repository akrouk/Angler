const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const jsonPath = 'commands/data/valheim-server.json';

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configure')
		.setDescription('Configures Thjarkur to use the IP address specified.')
        .addStringOption(option => 
            option.setName('address').setDescription('Input the IP address of the Valheim server.').setRequired(true)
        )
        .addStringOption(option =>
            option.setName('name').setDescription('Input the name of the Valheim server (optional).')
        ),
	async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

        const fsPromises = require('fs').promises; 

        try {
            // Get options
            let inputAddress = await interaction.options.getString('address');
            let inputName = await interaction.options.getString('name');

            // Verify that address is IPv4 (standard for Valheim)
            isValidIP(inputAddress);

            // Store data in json 
            const jsonData = JSON.stringify({ address: inputAddress, name: inputName }, null, 4);
            await fsPromises.writeFile(jsonPath, jsonData)
            await interaction.reply({ content: `${inputAddress} successfully stored!`, ephemeral: true });
        } catch (error) {
            if (error instanceof ValidationError) {
                await interaction.reply({ content: error.message, ephemeral: true });
            } else {
                console.log('\nConfigure was called, but something went wrong.');
                console.log(error);
            }
        }
	}
};

function isValidIP(string) {
    const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    if (!regexExp.test(string)) throw new ValidationError('Error: Invalid IP address.');
}