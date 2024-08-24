const fs = require('fs');
const { fetchServerInfo } = require('../../data/fetchServerInfo');


let serverStatusData = null;
let updateInterval = null;

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

    const statusUpdate = serverInfoUpdate.status === 'online' ? 'Online' : 'Offline';
    const playerCountUpdate = serverInfoUpdate.playersOnline;

    const messageTextUpdate = `## VediPura PvP v1\n**Status**: ${statusUpdate}\n**Players**: ${playerCountUpdate}`;

    try {
        const updateChannel = message.client.channels.cache.get(serverStatusData.channelId);
        if (!updateChannel) {
            console.error('Channel not found for update.');
            return;
        }
        const updateMessage = await updateChannel.messages.fetch(serverStatusData.messageId);
        await updateMessage.edit(messageTextUpdate);
    } catch (error) {
        console.error('Error updating message:', error);
    }
};

module.exports = {
    name: 'setguildv4',
    description: 'Sets the server status message in the specified channel and updates it every 5 minutes.',
    async execute(message, args) {
        const channelMention = message.mentions.channels.first();
        if (!channelMention) {
            return message.reply('Please mention a channel to set the server status message.');
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

        const status = serverInfo.status === 'online' ? 'Online' : 'Offline';
        const playerCount = serverInfo.playersOnline;

        const messageText = `## VediPura PvP v1\n**Status**: ${status}\n**Players**: ${playerCount}`;

        try {
            const sentMessage = await channel.send(messageText);

            if (serverStatusData) {
                clearInterval(updateInterval);
            }

            serverStatusData = {
                channelId: channel.id,
                messageId: sentMessage.id,
            };
            fs.writeFileSync('./data/serverstatus.json', JSON.stringify(serverStatusData));

            updateInterval = setInterval(() => updateMessage(message), 5 * 60 * 1000);
            message.channel.send(`Server status message set in ${channel}.`);
        } catch (error) {
            console.error('Error sending message:', error);
            message.channel.send('Failed to set server status message. Please try again later.');
        }
    },
};