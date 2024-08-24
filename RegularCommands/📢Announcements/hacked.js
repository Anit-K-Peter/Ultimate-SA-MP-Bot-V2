
const { MessageEmbed, Client, Intents } = require('discord.js');
const { url } = require('inspector');
const config = require('../../config.nes.js');

module.exports = {
  name: 'hacked',
  description: 'Sends an hacked announcement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
    .setColor('RED')
    .setTitle(' Server Compromised: Security Incident')
    .setDescription('**URGENT NOTICE**: Our server has been compromised by a malicious attack. We apologize for any inconvenience this may cause and are working diligently to resolve the issue and restore security. Please be cautious and do not attempt to access the server until further notice.')
    .setFooter({ text: 'We apologize for the disruption and appreciate your understanding.' })
    .setImage('https://media.discordapp.net/attachments/1262375217624252417/1263925466092535858/alert.gif?ex=669c01d1&is=669ab051&hm=764563f6199788754ca1fc1b46dd713495bb88edee51f68479a387a095089ce8&=')
    .setTimestamp();


    targetChannel.send({ content: '@everyone', embeds: [embed] });
    message.reply('Announcement sent!');
  }
};


