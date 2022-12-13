const { StringSelectMenuBuilder, formatEmoji } = require('@discordjs/builders');
const { ActionRowBuilder, Events, CommandInteraction, EmbedBuilder, ComponentType } = require('discord.js');
const { Deck } = require('../../util/cards/deck');
const emojis = require('../../emojis.json');

module.exports = {
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const hasJokers = interaction.options.getBoolean('jokers');

        const deck = new Deck(hasJokers).shuffle();
        const playerHand = deck.drawHand(), botHand = deck.drawHand();

        const selectMenuOptions = playerHand.ranks.map(rank => ({
                label: rank, 
                description: `Ask for a ${rank}.`, 
                value: rank,
                emoji: emojis.queen
            })
        );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Ask for a card')
            .addOptions(...selectMenuOptions)

        const row = new ActionRowBuilder().addComponents(selectMenu);
        
        const hands = `${playerHand.ranks.join()}\n${botHand.ranks.join()}`
        const message = await interaction.reply({ content: hands, components: [ row ] });
        
        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 15000
        });

        collector.on('collect', i => {
            const selectedRank = i.values[0];
            const match = botHand.ranks.includes(selectedRank);
            match ? i.reply(`Bot has ${selectedRank}!`) : i.reply(`Bot doesn't have ${selectedRank}.`);
        });

        collector.on('end', () => {
            selectMenu.setDisabled(true);
            row.setComponents(selectMenu);
            interaction.editReply({ components: [ row ] });
        });
    }
}