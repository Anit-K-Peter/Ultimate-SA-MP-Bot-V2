const { SlashCommandBuilder } = require('@discordjs/builders');
const { fetchServerInfo } = require('../../data/fetchServerInfo');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Displays the current server status of vedipura.'),

  async execute(interaction) {
    const serverInfo = await fetchServerInfo();
    const ipPort = await fetchServerInfo();

    if (!serverInfo) {
      return interaction.reply({ content: 'Failed to fetch server information. Please try again later.', ephemeral: true });
    }

    if (!ipPort) {
      return interaction.reply({ content: 'Failed to fetch server information. Please Try again later', ephermeral: true });
    }

    const status = serverInfo.status === 'online' ? 'Online' : 'Online';
    const playerCount = serverInfo.playersOnline;
    const ipadress = serverInfo.ipPort;

    const response = `---------------------Vedipura Status---------------------\n**Server Status:** ${status}\n**Players Online:** ${playerCount}\n**Ip Address:** ${ipadress}\n---------------------------------------------------------`;

    await interaction.reply({ content: response });
  },
};