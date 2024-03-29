const read = require('fs-readdir-recursive');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { clientId, token } = require('./config.json');

require('./util/general/prototypes').definePrototypeFunctions();

const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });

client.commands = new Collection();
const commandFiles = read('./commands').filter(file => file.endsWith('.c.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Angler is online.');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);