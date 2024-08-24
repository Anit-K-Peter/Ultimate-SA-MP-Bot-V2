const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unbanig')
    .setDescription('Unban a user with reason and rejoin date')
    .addStringOption(option => option.setName('name').setDescription('The username of the user to unban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the unban').setRequired(true))
    .addStringOption(option => option.setName('rejoin').setDescription('The date the user can rejoin').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const name = interaction.options.getString('name');
    const reason = interaction.options.getString('reason');
    const rejoin = interaction.options.getString('rejoin');

    const unbanEmbed = new MessageEmbed()
      .setTitle('**__UNBAN LOG__**')
      .setDescription(`${name} has been unbanned\nReason: ${reason}\nRejoin: ${rejoin}`)
      .setColor('GREEN')
      .setFooter({ text: `Unbanned by ${interaction.user.username}` });

    const channelId = config.unbanLogChannelId;
    const channel = interaction.client.channels.cache.get(channelId);
    if (!channel) {
      return;
    }

    channel.send({ embeds: [unbanEmbed] });

    interaction.reply({ content: 'Unban log sent successfully!', ephemeral: true });
  },
};