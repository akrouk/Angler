const { Hand } = require('./hand');
const { StringSelectMenuBuilder, bold } = require('@discordjs/builders');
const { ActionRowBuilder, CommandInteraction, ComponentType, InteractionReplyOptions } = require('discord.js');
const emojis = require('../../emojis.json');

/**
 * 
 * @param {{ 
 *  hand: Hand, 
 *  interaction: CommandInteraction, 
 *  replyOptions?: InteractionReplyOptions, 
 *  time?: number
 * }} options 
 * @returns {Promise<string|undefined>}
 */
async function selectRank(options) {
    let { hand, interaction, replyOptions, time } = options;

    const selectMenuOptions = hand.ranks.map(rank => ({
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
    
    const message = await interaction.reply({ 
        ...replyOptions, 
        components: [ row ]
    });
    
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: time ?? 15000
    });

    return new Promise(resolve => {
        collector.on('collect', i => {
            selectMenu.setDisabled(true);
            row.setComponents(selectMenu);
            i.update({ components: [ row ] });

            resolve(i.values[0]);
        });
    
        collector.on('end', () => {
            if (selectMenu.data.disabled) {
                return;
            }
    
            selectMenu.setDisabled(true);
            row.setComponents(selectMenu);
            interaction.editReply({ components: [ row ] });

            resolve(undefined);
        });
    });
}

module.exports = { selectRank }