const fs = require('fs');
const { fetchServerInfo } = require('../../data/fetchServerInfo');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'update',
    description: 'Updates the server info message content and channel name with player count.',
    async execute(message, args) {
        let channelData;
        try {
            channelData = JSON.parse(fs.readFileSync('./data/guildchannel.json', 'utf8'));
        } catch (error) {
            console.error('Error reading guildchannel.json:', error);
            message.channel.send('Failed to read channel data.');
            return;
        }

        const guild = message.guild;
        const channelId = channelData.channelId;

        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            message.channel.send('Channel does not exist. Use `!createchannel` to create it.');
            return;
        }

        const updateMessage = async () => {
            let serverInfoUpdate;
            try {
                serverInfoUpdate = await fetchServerInfo();
                if (!serverInfoUpdate) {
                    console.error('Failed to fetch server information for update.');
                    return message.channel.send('Failed to fetch server information for update. Please try again later.');
                }
            } catch (error) {
                console.error('Error fetching server information for update:', error);
                return message.channel.send('Error fetching server information for update. Please try again later.');
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

            const embedUpdate = new MessageEmbed()
                .setColor('#47ff00')
                .setTitle(serverInfoUpdate.serverName || 'Server Information')
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
                    return message.channel.send('Channel not found for update. Please set the server info message again using !setguild.');
                }
                const updateMessage = await updateChannel.messages.fetch(guildMessageData.messageId);
                if (!updateMessage) {
                    console.error('Message not found for update.');
                    return message.channel.send('Message not found for update. Please set the server info message again using !setguild.');
                }
                await updateMessage.edit({ embeds: [embedUpdate] });
                message.channel.send('Server info message content updated successfully.');
            } catch (error) {
                console.error('Error updating message:', error);
                message.channel.send('Failed to update server info message content. Please try again later.');
            }
        };

        const updateChannelName = async () => {
            const serverInfo = await fetchServerInfo();
            if (serverInfo && serverInfo.playersOnline !== undefined) {
                try {
                    await channel.setName(`Online Players: ${serverInfo.playersOnline}`);
                    message.channel.send(`Channel ${channel.name} updated.`);
                } catch (error) {
                    console.error('Error updating channel name:', error);
                    message.channel.send('There was an error updating the channel name.');
                }
            } else {
                console.error('Failed to fetch player count for updating channel name.');
                message.channel.send('Failed to update channel. Try again later.');
            }
        };

        await Promise.all([updateMessage(), updateChannelName()]);
    },
};
