const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.nes.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwhitelist')
    .setDescription('Unwhitelist a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to unwhitelist')
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      await interaction.reply(`User not found in the guild!`);
      return;
    }

    const roleToRemoveId = config.roleToRemoveId;
    const roleToAddId = config.roleToAddId;
    const logChannelId = config.logChannelId;

    const roleToRemove = interaction.guild.roles.cache.get(roleToRemoveId);
    const roleToAdd = interaction.guild.roles.cache.get(roleToAddId);

    if (!roleToRemove || !roleToAdd) {
      await interaction.reply(`One or both roles not found!`);
      return;
    }

    if (member.roles.cache.has(roleToAddId)) {
      await interaction.reply(`User already has the ${roleToAdd.name} role!`);
      return;
    }

    await member.roles.remove(roleToRemove);
    await member.roles.add(roleToAdd);

    const logChannel = interaction.guild.channels.cache.get(logChannelId);
    if (logChannel) {
      logChannel.send(`**Unwhitelisted User**: ${user.username} (${user.id})\n**Removed Role**: ${roleToRemove.name} (${roleToRemoveId})\n**Added Role**: ${roleToAdd.name} (${roleToAddId})`);
    }

    await interaction.reply(`Removed ${roleToRemove.name} and added ${roleToAdd.name} from ${user.username}!`);
  },
};