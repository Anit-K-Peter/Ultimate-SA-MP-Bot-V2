const { fetchServerInfo } = require('../../data/fetchServerInfo');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'setguild',
    description: 'Sets the server info message in the specified channel and updates it every 5 minutes.',
    async execute(message, args) {
        const channelMention = message.mentions.channels.first();
        if (!channelMention) {
            return message.reply('Please mention a channel to set the server info message.');
        }

        const channel = channelMention;

        let serverInfo;
        try {
            serverInfo = await fetchServerInfo();
            if (!serverInfo) {
                return message.reply('Failed to fetch server information. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching server information:', error);
            return message.reply('Failed to fetch server information. Please try again later.');
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

        const embedMessage = new MessageEmbed()
            .setColor('#47ff00')
            .setTitle(serverInfo.serverName || 'Server Information')
            .setImage('https://www.gs4u.net/en/350x20/s/346638.png') // Set the image URL
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

        try {
            const sentMessage = await channel.send({ embeds: [embedMessage] });

            const guildMessageData = {
                channelId: channel.id,
                messageId: sentMessage.id,
            };
            fs.writeFileSync('./data/guildmessage.json', JSON.stringify(guildMessageData));

            message.channel.send(`Server info message set in ${channel}.`);
        } catch (error) {
            console.error('Error sending message:', error);
            message.channel.send('Failed to set server info message. Please try again later.');
        }

        const updateMessage = async () => {
            let serverInfoUpdate;
            try {
                serverInfoUpdate = await fetchServerInfo();
                if (!serverInfoUpdate) {
                    console.error('Failed to fetch server information for update.');
                    return;
                }
            } catch (error) {
                console.error('Error fetching server information for update:', error);
                return;
            }

            const embedUpdate = new MessageEmbed()
                .setColor('#47ff00')
                .setTitle(serverInfoUpdate.serverName || 'Server Information')
                .setImage('https://www.gs4u.net/en/350x20/s/346638.png') // Set the image URL
                .addFields(
                    { name: `${emojiMap.status} Status`, value: serverInfoUpdate.status, inline: true },
                    { name: `${emojiMap.ipPort} IP:Port`, value: serverInfoUpdate.ipPort, inline: true },
                    { name: `${emojiMap.game} Game`, value: serverInfoUpdate.game, inline: true },
                    { name: `${emojiMap.mode} Mode`, value: serverInfoUpdate.mode, inline: true },
                    { name: `${emojiMap.version} Version`, value: serverInfoUpdate.version, inline: true },
                    { name: `${emojiMap.playersOnline} Players Online`, value: `${serverInfoUpdate.playersOnline} of 600`, inline: true },
                    { name: `${emojiMap.location} Location`, value: serverInfoUpdate.location, inline: true },
                    { name: `${emojiMap.added} Added`, value: serverInfoUpdate.added, inline: true },
                { name: `${emojiMap.lastUpdated} Last Updated`, value: serverInfoUpdate.lastUpdated, inline: true }
            )
           .setTimestamp();

            try {
                const guildMessageData = JSON.parse(fs.readFileSync('./data/guildmessage.json', 'utf8'));
                const updateChannel = message.client.channels.cache.get(guildMessageData.channelId);
                if (!updateChannel) {
                    console.error('Channel not found for update.');
                    return;
                }
                const updateMessage = await updateChannel.messages.fetch(guildMessageData.messageId);
                await updateMessage.edit({ embeds: [embedUpdate] });
            } catch (error) {
                console.error('Error updating message:', error);
            }
        };

        await updateMessage();

        setInterval(updateMessage, 5 * 60 * 1000);
    },
};