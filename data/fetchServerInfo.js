const axios = require('axios');
const cheerio = require('cheerio');
const { serverInfoUrl } = require('../config');

const fetchServerInfo = async () => {
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

        const playersOnlineText = $('.baseinfo .row-fluid:nth-child(5) .value .playersonline b').first().text().trim();
        const playersOnline = parseInt(playersOnlineText, 10) || 0;
        serverInfo.playersOnline = playersOnline;

        const location = $('.baseinfo .row-fluid:nth-child(6) .value b').text().trim();
        serverInfo.location = location;

        const added = $('.baseinfo .row-fluid:nth-child(7) .value').text().trim();
        serverInfo.added = added;

        const lastUpdated = $('#server_countdown').text().trim();
        serverInfo.lastUpdated = lastUpdated;

        const players = [];
        $('.serverplayers tbody tr').each((index, row) => {
            const playerName = $(row).find('td.other_color_text').text().trim();
            const score = $(row).find('td.score').text().trim();
            const ping = $(row).find('td.ping').text().trim();

            players.push({
                playerName,
                score,
                ping,
            });
        });

        serverInfo.players = players;

        return serverInfo;
    } catch (error) {
        console.error('Error fetching server information:', error);
        return null;
    }
};

module.exports = { fetchServerInfo };