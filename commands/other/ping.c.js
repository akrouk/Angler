const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const catches = require('../../util/general/catches'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping Angler!')
        .addStringOption(option => 
            option
                .setName('type') 
                .setDescription('Ping a type of catch!')
                .addChoices(
                    { name: 'Crustacean', value: 'crustacean'},
                    { name: 'Fish', value: 'fish' },
                    { name: 'Mammal', value: 'mammal' },
                    { name: 'Mollusk', value: 'mollusk' }
                )   
        )
        .addStringOption(option => {
            // I'm lazy and don't want to reorganize catches.js to be alphabetical... :)
            const choices = [...catches.values()]
                .slice(1)
                .sort((a, b) => a.name.localeCompare(b.name));
            
            return option
                .setName('catch')
                .setDescription('Ping a specific catch!')
                .addChoices(...choices);
        }),
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute(interaction) {
        const emoji = interaction.options.get('catch'), type = interaction.options.get('type');

        if (emoji && type) {
            await interaction.reply({ ephemeral: true, content: emoji.value });

            const types = catches.filter(c => c.type === type.value);
            const match = types.find(c => c.value === emoji.value)

            let message = match
                ? `That's right, a ${match.name.toLowerCase()} is a ${type.value}!` 
                : `Hm... I don't think that's a ${type.value}.`;

            if (match && match.name.toLowerCase() === type.value) {
                message += '\n(A marine axiom?)';
            }

            return await interaction.followUp({ ephemeral: true, content: message });
        }

        if (emoji) {
            return await interaction.reply({ ephemeral: true, content: emoji.value });
        }
        
        if (type) {
            const r = catches.filter(c => c.type === type.value).random();
            return await interaction.reply({ ephemeral: true, content: r.value });
        }

        return await interaction.reply({ ephemeral: true, content: catches.random().value });
	}
};