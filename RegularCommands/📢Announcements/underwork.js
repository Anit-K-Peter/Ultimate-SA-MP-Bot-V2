
const { MessageEmbed, Client, Intents } = require('discord.js');
const { url } = require('inspector');
const config = require('../../config.nes.js');

module.exports = {
  name: 'underwork',
  description: 'Sends an underwork announcement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle('🏗 Server Under Maintenance')
      .setDescription('Attention all players! Our server is currently undergoing maintenance to improve your gaming experience. We apologize for any inconvenience caused and appreciate your patience. Stay tuned for updates on when the server will be back online.')
      .setFooter({ text: 'We appreciate your patience and support.' })
      .setImage('https://media.discordapp.net/attachments/1262375217624252417/1263925466092535858/standard_1.gif?ex=669c01d1&is=669ab051&hm=764563f6199788754ca1fc1b46dd713495bb88edee51f68479a387a095089ce8&=')
      .setTimestamp();


    targetChannel.send({ content: '@everyone', embeds: [embed] });
    message.reply('Announcement sent!');
  }
};


