const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const serverFields = require('../../data/serverfields.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vedipura')
    .setDescription('Displays Vedipura server information'),

  async execute(interaction) {
    const guildIconURL = interaction.guild.iconURL();
    const userAvatarURL = interaction.user.avatarURL();
    const nowTimestamp = new Date().toISOString();

    const embed = new MessageEmbed()
      .setTitle('Vedipura | VPVP')
      .setColor('#000000')
      .setDescription('Welcome to Vedipura City, a vibrant metropolis where imagination knows no bounds.Within these digital streets,')
      .setAuthor({ name: '*The Vedipura PVP*', iconURL: guildIconURL })
      .setThumbnail(guildIconURL)
      .setFooter(`Requested From ${interaction.user.username}`, userAvatarURL)
      .setTimestamp(nowTimestamp);

    // Load fields from serverfields.json
    const fields = serverFields.map((field) => {
      return {
        name: field.name,
        value: field.value,
        inline: field.inline ?? true, // default to true if inline is not specified
      };
    });

    embed.addFields(fields);

    await interaction.reply({ embeds: [embed] });
  },
};