const { MessageEmbed, Client, Intents } = require('discord.js');
const { url } = require('inspector');
const config = require('../../config.nes.js');

module.exports = {
  name: 'offline',
  description: 'Sends an Offline annnouncement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle('🔴 Server Host Down')
      .setDescription('We are currently facing downtime due to issues with our server host. Our technical team is on it, and we hope to resolve this soon. We apologize for any inconvenience caused and will keep you updated with the latest information.')
      embed.setFooter({ text: 'We appreciate your patience and support.' })
      .setImage('https://media.discordapp.net/attachments/1262375217624252417/1263925466469765274/standard.gif?ex=669c01d1&is=669ab051&hm=fcae0d33a57f8a5d223d3a5bb289921791b4ef01d9ea34aceb506371276e96d0&=')
      .setTimestamp();
      

      targetChannel.send({ content: '@everyone', embeds: [embed] });
      message.reply('Announcement sent!');
    }
  };