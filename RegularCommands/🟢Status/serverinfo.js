const axios = require('axios');
const cheerio = require('cheerio');
const { serverInfoUrl, guildId } = require('../../config');
const { Client, MessageEmbed } = require('discord.js');

const fetchServerInfo = async () => {
  if (!serverInfoUrl || typeof serverInfoUrl !== 'string') {
    console.error('Error: serverInfoUrl is not defined or is not a string');
    return null;
  }

  try {
    const response = await axios.get(serverInfoUrl);
    const $ = cheerio.load(response.data);

    const serverInfo = {};

    const serverName = $('h1[itemprop="name"]').text().trim();
    serverInfo.serverName = serverName;

    const status = $('.status .value .serverstatustext').text().trim();
    serverInfo.status = status;

    const ipPort = $('#server_addr_0').text().trim();
    serverInfo.ipPort = ipPort;

    const game = $('.baseinfo .row-fluid:nth-child(2) .value a').text().trim();
    serverInfo.game = game;

    const mode = $('.baseinfo .row-fluid:nth-child(3) .value').text().trim();
    serverInfo.mode = mode;

    const version = $('.baseinfo .row-fluid:nth-child(4) .value').text().trim();
    serverInfo.version = version;

    const playersOnline = $('.baseinfo .row-fluid:nth-child(5) .value .playersonline b').first().text().trim();
    serverInfo.playersOnline = playersOnline;

    const location = $('.baseinfo .row-fluid:nth-child(6) .value b').text().trim();
    serverInfo.location = location;

    const added = $('.baseinfo .row-fluid:nth-child(7) .value').text().trim();
    serverInfo.added = added;

    const lastUpdated = $('#server_countdown').text().trim();
    serverInfo.lastUpdated = lastUpdated;

    return serverInfo;
  } catch (error) {
    console.error('Error fetching server information:', error);
    return null;
  }
};

module.exports = {
  name: 'setguildv3',
  description: 'Fetches information about the game server.',
  async execute(message, args) {
    const serverInfo = await fetchServerInfo();
    if (!serverInfo) {
      message.channel.send('Error fetching server information. Please try again later.');
      return;
    }

    const emojiMap = {
      status: '🌐',
      ipPort: '🖥️',
      game: '🎮',
      mode: '⚙️',
      version: '🔧',
      playersOnline: '👥',
      location: '📍',
      added: '📅',
      lastUpdated: '🕒'
    };

    const guild = message.client.guilds.cache.get(guildId);

    const embedMessage = new MessageEmbed()
      .setColor('#47ff00')
      .setTitle(serverInfo.serverName)
      .addFields(
        { name: `${emojiMap.status} Status`, value: serverInfo.status, inline: true },
        { name: `${emojiMap.ipPort} IP:Port`, value: serverInfo.ipPort, inline: true },
        { name: `${emojiMap.game} Game`, value: serverInfo.game, inline: true },
        { name: `${emojiMap.mode} Mode`, value: serverInfo.mode, inline: true },
        { name: `${emojiMap.version} Version`, value: serverInfo.version, inline: true },
        { name: `${emojiMap.playersOnline} Players Online`, value: `${serverInfo.playersOnline} of 600`, inline: true },
        { name: `${emojiMap.location} Location`, value: serverInfo.location, inline: true },
        { name: `${emojiMap.added} Added`, value: serverInfo.added, inline: true },
        { name: `${emojiMap.lastUpdated} Last Updated`, value: serverInfo.lastUpdated, inline: true }
      )
      .setTimestamp();

    if (guild && guild.iconURL()) {
      embedMessage.setThumbnail(guild.iconURL({ dynamic: true }));
    }

    message.channel.send({ embeds: [embedMessage] });
  },
};