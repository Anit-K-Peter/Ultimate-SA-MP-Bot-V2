const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Displays basic information about the server'),
  async execute(interaction) {
    const guild = interaction.guild; // Get the guild object from the interaction

    const embed = new MessageEmbed()
      .setTitle('Server Information')
      .setDescription(`**Server Name:** ${guild.name}\n` +
                      `**Server ID:** ${guild.id}\n` +
                      `**Members:** ${guild.memberCount}\n` +
                      `**Creation Date:** ${guild.createdAt.toDateString()}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor('#000000'); // Discord color

    try {
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending message:', error);
      interaction.reply('Failed to send the server information. Ensure the bot has the necessary permissions.');
    }
  },
};