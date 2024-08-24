const players = require('../../data/players.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('player')
    .setDescription('Display player information')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the player')
        .setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (!player) {
      const similarNames = players
        .filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
        .map(p => p.name)
        .join(', ');
      return interaction.reply(`Player with name ${name} not found. Did you mean: ${similarNames || 'No similar names found'}`);
    }

    const embed = new MessageEmbed()
      .setTitle("Profile Information")
      .setDescription("Details about the user.")
      .setColor(5814783)
      .addFields(
        { name: "Name", value: player.name, inline: true },
        { name: "Discord User", value: `<@${player.discordId}>`, inline: true },
        { name: "Joined Server", value: player.serverName }
      )
      .setFooter({ text: "Profile information generated on", iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true }) })
      .setTimestamp()
      .setThumbnail(`attachment://Skin_${player.skinId}.png`)
      .setColor('#000000');

    await interaction.reply({ embeds: [embed], files: [`./data/Skins/Skin_${player.skinId}.png`] });
  },
};