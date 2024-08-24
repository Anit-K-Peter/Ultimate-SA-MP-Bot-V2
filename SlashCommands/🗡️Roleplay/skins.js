const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skininfo')
    .setDescription('Get information about a skin.')
    .addStringOption(option =>
      option.setName('skinid')
        .setDescription('The ID of the skin.')
        .setRequired(true)),
  async execute(interaction) {
    const skinId = interaction.options.getString('skinid');
    const skinsData = fs.readFileSync('./data/skinsid.json', 'utf8');
    const skins = JSON.parse(skinsData);

    const skin = skins.find(skin => skin.id === skinId);
    if (!skin) {
      return interaction.reply(`Skin with ID ${skinId} not found.`);
    }

    const skinEmbed = new MessageEmbed()
      .setColor('#ffa500')
      .setTitle(`Skin Information: ${skin.name}`)
      .setDescription(`**Model Name:** ${skin.modelName}\n` +
                      `**Type:** ${skin.type}\n` +
                      `**Location:** ${skin.location}\n` +
                      `**Gender:** ${skin.gender}`)
      .setThumbnail(`attachment://Skin_${skinId}.png`);

    await interaction.reply({ embeds: [skinEmbed], files: [`./data/Skins/Skin_${skinId}.png`] });
  },
};