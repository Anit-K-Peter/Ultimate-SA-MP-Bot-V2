const { fetchServerInfo } = require('../../data/fetchServerInfo'); 
const { MessageEmbed } = require('discord.js'); 
const fs = require('fs'); 

module.exports = { 
    name: 'setguildv2', 
    description: 'Sets the server info message in the specified channel and updates it every 1 minute. ', 
    async execute(message, args) { 
        const channelMention = message.mentions.channels.first(); 
        if (!channelMention) { 
            return message.reply('Please mention a channel to set the server info message. '); 
        } 

        const channel = channelMention; 

        let serverInfo; 
        try { 
            serverInfo = await fetchServerInfo(); 
            if (!serverInfo) { 
                return message.reply('Failed to fetch server information. Please try again later. '); 
            } 
        } catch (error) { 
            console.error('Error fetching server information:', error); 
            return message.reply('Failed to fetch server information. Please try again later. '); 
        } 

        const emojiMap = { 
            status: '🌐', 
            ipPort: '🖥️', 
            game: '🎮', 
            playersOnline: '👥', 
            lastUpdated: '🕒' 
        }; 

        const embedMessage = new MessageEmbed() 
            .setColor('#47ff00') 
            .setTitle(serverInfo.serverName || 'Server Information') 
            .setDescription(` 
                **${emojiMap.playersOnline} Players Online**:${serverInfo.playersOnline} of 100\n**${emojiMap.game} Game**:${serverInfo.game}\n**${emojiMap.status} Status**:${serverInfo.status}\n**${emojiMap.ipPort} IP:Port**:${serverInfo.ipPort}\n**${emojiMap.lastUpdated} Last Updated**:${serverInfo.lastUpdated} 
            `) 
            .setThumbnail(message.guild.iconURL({ dynamic: true })) 
            .setFooter({ text: 'Join and play! ', iconURL: message.guild.iconURL({ dynamic: true }) }) 
            .setTimestamp(); 

        try { 
            const sentMessage = await channel.send({ embeds: [embedMessage] }); 

            const guildMessageData = { 
                channelId: channel.id, 
                messageId: sentMessage.id, 
            }; 
            fs.writeFileSync('./data/guildmessagebutton.json', JSON.stringify(guildMessageData)); 

            message.channel.send(`Server info message set in ${channel}.`); 

            // Update message every 1 minute
            setInterval(async () => { 
                let serverInfoUpdate; 
                try { 
                    serverInfoUpdate = await fetchServerInfo(); 
                    if (!serverInfoUpdate) { 
                        return console.error('Failed to fetch server information.'); 
                    } 
                } catch (error) { 
                    console.error('Error fetching server information:', error); 
                    return; 
                } 

                const updatedEmbedMessage = new MessageEmbed() 
                    .setColor('#47ff00') 
                    .setTitle(serverInfoUpdate.serverName || 'Server Information') 
                    .setDescription(` 
                        **${emojiMap.playersOnline} Players Online**:${serverInfoUpdate.playersOnline} of 100\n**${emojiMap.game} Game**:${serverInfoUpdate.game}\n**${emojiMap.status} Status**:${serverInfoUpdate.status}\n**${emojiMap.ipPort} IP:Port**:${serverInfoUpdate.ipPort}\n**${emojiMap.lastUpdated} Last Updated**:${serverInfoUpdate.lastUpdated} 
                    `) 
                    .setThumbnail(message.guild.iconURL({ dynamic: true })) 
                    .setFooter({ text: 'Join and play! ', iconURL: message.guild.iconURL({ dynamic: true }) }) 
                    .setTimestamp(); 

                try { 
                    await sentMessage.edit({ embeds: [updatedEmbedMessage] }); 
                } catch (error) { 
                    console.error('Error editing message:', error); 
                } 
            }, 60000); // 60000 milliseconds = 1 minute
        } catch (error) { 
            console.error('Error sending message:', error); 
            message.channel.send('Failed to set server info message. Please try again later. '); 
        } 
    } 
}; 