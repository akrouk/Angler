const { bold } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

/**
 * Resolves the path to a subcommand file.
 * @param {CommandInteraction} interaction 
 * @returns {string}
 */
function resolveCommandPath(interaction) {
    const groupName = interaction.options.getSubcommandGroup(false);
    const groupPath = groupName ? `${groupName}/` : '';
    return `./${groupPath}${interaction.options.getSubcommand()}.s`;
}

module.exports = { resolveCommandPath }