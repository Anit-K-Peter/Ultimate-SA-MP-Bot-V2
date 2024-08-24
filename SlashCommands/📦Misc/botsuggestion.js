const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botsuggestion')
    .setDescription('Send a suggestion to the bot creator.')
    .addStringOption(option =>
      option.setName('suggestion')
        .setDescription('The suggestion')
        .setRequired(true)),

  async execute(interaction) {
    const suggestion = interaction.options.getString('suggestion');
    const creatorID = config.creatorID;
    const creator = interaction.client.users.cache.get(creatorID);
    if (!creator) {
      return interaction.reply('Could not find the bot creator.');
    }

    const suggestionEmbed = new MessageEmbed()
      .setColor('#ffa500')
      .setTitle('New Suggestion')
      .setDescription(`**From:** ${interaction.user.tag} (<@${interaction.user.id}>)\n# ${suggestion}`);

    creator.send({ embeds: [suggestionEmbed] })
      .then(() => {
        interaction.reply('Your suggestion has been sent to the bot creator.');
      })
      .catch(error => {
        console.error(`Could not send suggestion to bot creator: ${error}`);
        interaction.reply('There was an error sending your suggestion. Please try again later.');
      });
  },
};