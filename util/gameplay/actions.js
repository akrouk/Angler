const { Deck, Hand } = require('../cards');
const { ButtonBuilder, StringSelectMenuBuilder, SelectMenuOptionBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonStyle, ComponentType, Message, MessagePayload, StringSelectMenuInteraction } = require('discord.js');
const emojis = require('../../emojis.json');

/**
 * Waits for a player to make a selection with a message component.
 * @param {{ 
 *  userId: string, 
 *  message: Message, 
 *  componentType: ComponentType, 
 *  time?: number
 * }} options 
 * @returns 
 */
async function awaitSelection(options) {
    let { userId, message, componentType, time = 30000 } = options;

    try {
        const filter = i => (i.deferUpdate(), i.user.id === userId);
        const messageComponent = await message.awaitMessageComponent({ filter, componentType, time });
        
        if (messageComponent instanceof StringSelectMenuInteraction) {
            return messageComponent.values[0];
        }

        return messageComponent.customId;
    } catch {
        return undefined;
    }
}

/**
 * 
 * @param {{
 *  component: ButtonBuilder | StringSelectMenuBuilder,
 *  row: ActionRowBuilder,
 *  message: Message
 * }} options 
 */
async function disableComponent(options) {
    let { component, row, message } = options;
    component.setDisabled(true)
    row.setComponents(component);
    message.edit({ components: [ row ] });
}

/**
 * Player chooses a card rank from their hand.
 * @param {{ 
 *  userId: string,
 *  hand: Hand, 
 *  message: Message<boolean>, 
 *  editOptions?: MessagePayload, 
 *  time?: number
 * }} options 
 * @returns
 */
async function playerTurn(options) {
    let { userId, hand, message, editOptions, time } = options; 

    /** @param {string} rank */
    const rankToSelectMenuOption = rank => ({
        label: rank, 
        description: `Ask for a ${rank}.`, 
        value: rank,
        emoji: emojis[rank.toLowerCase()]
    });

    const selectMenuOptions = hand.ranks.map(rankToSelectMenuOption);
    
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select')
        .setPlaceholder('Ask for a card')
        .addOptions(...selectMenuOptions)

    const row = new ActionRowBuilder().addComponents(selectMenu);
    await message.edit({ ...editOptions, components: [ row ] });

    const selection = await awaitSelection({ 
        userId, 
        message,
        componentType: ComponentType.StringSelect,
        time
    });

    await disableComponent({ component: selectMenu, row, message });
    return selection;
}

/**
 * Player chooses a card rank from their hand.
 * @param {{ 
 *  userId: string,
 *  hand: Hand, 
 *  deck: Deck,
 *  message: Message<boolean>, 
 *  editOptions?: MessagePayload, 
 *  time?: number
 * }} options 
 * @returns
 */
async function goFish(options) {
    let { userId, hand, deck, message, editOptions, time } = options; 

    const button = new ButtonBuilder()
        .setCustomId('gofish')
        .setLabel('🎣 GO FISH 🎣')
        .setStyle(ButtonStyle.Primary)

    const row = new ActionRowBuilder().addComponents(button);
    await message.edit({ ...editOptions, components: [ row ] });

    const selection = await awaitSelection({ 
        userId, 
        message,
        componentType: ComponentType.Button,
        time
    });

    await disableComponent({ component: button, row, message });

    if (selection === 'gofish') {
        const draw = deck.draw();
        return draw ? hand.add(draw) : [];
    } else {
        return undefined;
    }
}

module.exports = { goFish, playerTurn }