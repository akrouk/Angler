const read = require('fs-readdir-recursive');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = new Array();
const commandFiles = read('./commands').filter(file => file.endsWith('.c.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    console.log(`Pushing ${command.data.name} command...`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);