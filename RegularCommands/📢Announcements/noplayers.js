const { MessageEmbed, Client, Intents } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'noplayers',
  description: 'Sends a no players mode announcement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
     .setColor('GREEN')
     .setTitle('JOIN THE SERVER AND MAKE IT ACTIVE!')
     .setDescription('The server is currently empty. Join now and help bring it back to life!')
     .setFooter({ text: 'Your presence is needed!' })
     .setImage('https://media.discordapp.net/attachments/1262375217624252417/1263925466092535858/join_server.gif?ex=669c01d1&is=669ab051&hm=764563f6199788754ca1fc1b46dd713495bb88edee51f68479a387a095089ce8&=')
     .setTimestamp();

    targetChannel.send({ content: '@everyone', embeds: [embed] });
    message.reply('Announcement sent!');
  }
};