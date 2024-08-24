const players = require('../../data/players.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
   .setName('myacc')
   .setDescription('Display information about your account'),
  async execute(interaction) {
    await interaction.deferReply(); // Defer the reply to ensure the interaction token remains valid

    const userId = interaction.user.id;
    const player = players.find(p => p.discordId === userId);

    if (!player) {
      return interaction.editReply('You don\'t have an account registered.');
    }

    const embed = new MessageEmbed()
     .setTitle(player.name)
     .setDescription(`<@${player.discordId}>`)
     .addFields(
        { name: 'Skin', value: player.skinId.toString(), inline: true },
        { name: 'Server', value: player.serverName, inline: true },
        { name: 'Private', value: player.private? 'Yes' : 'No', inline: true }
      )
     .setThumbnail(`attachment://Skin_${player.skinId}.png`)
     .setColor('#7289DA');

    await interaction.editReply({ embeds: [embed], files: [`./data/Skins/Skin_${player.skinId}.png`] });
  },
};