const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banig')
    .setDescription('Ban a user with reason and unban date')
    .addStringOption(option => option.setName('name').setDescription('The username of the user to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(true))
    .addStringOption(option => option.setName('unban').setDescription('The date the user can be unbanned').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const name = interaction.options.getString('name');
    const reason = interaction.options.getString('reason');
    const unban = interaction.options.getString('unban');

    const banEmbed = new MessageEmbed()
      .setTitle('**__BAN LOG__**')
      .setDescription(`${name} has been banned\nReason: ${reason}\nUnban: ${unban}`)
      .setColor('RED')
      .setFooter({ text: `Banned by ${interaction.user.username}` });

    const channel = interaction.client.channels.cache.get(config.banLogChannelId);
    if (!channel) {
      return;
    }

    channel.send({ embeds: [banEmbed] });

    interaction.reply({ content: 'Ban log sent successfully!', ephemeral: true });
  },
};