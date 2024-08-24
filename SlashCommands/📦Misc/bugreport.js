const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription('Report a bug to the bot creator.')
    .addStringOption(option =>
      option.setName('report')
        .setDescription('The bug report')
        .setRequired(true)),

  async execute(interaction) {
    const bugReport = interaction.options.getString('report');
    const creatorID = config.creatorID;
    const creator = interaction.client.users.cache.get(creatorID);
    if (!creator) {
      return interaction.reply('Could not find the bot creator.');
    }

    const bugReportEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('New Bug Report')
      .setDescription(`**Reported by:** ${interaction.user.tag} (<@${interaction.user.id}>)\n# ${bugReport}`);

    creator.send({ embeds: [bugReportEmbed] })
      .then(() => {
        interaction.reply('Your bug report has been sent to the bot creator.');
      })
      .catch(error => {
        console.error(`Could not send bug report to bot creator: ${error}`);
        interaction.reply('There was an error sending your bug report. Please try again later.');
      });
  },
};