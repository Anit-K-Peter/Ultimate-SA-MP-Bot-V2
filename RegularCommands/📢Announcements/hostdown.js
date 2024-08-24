const { MessageEmbed, Client, Intents } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'hostdown',
  description: 'Sends a host down announcement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle('HOST DOWN ANNOUNCEMENT')
      .setDescription('Our host is currently experiencing technical difficulties. We apologize for the inconvenience and are working to resolve the issue as soon as possible.')
      .setFooter({ text: 'We appreciate your patience and understanding.' })
      .setImage('https://media.discordapp.net/attachments/1262375217624252417/1263925466092535858/alert.gif?ex=669c01d1&is=669ab051&hm=764563f6199788754ca1fc1b46dd713495bb88edee51f68479a387a095089ce8&=')
      .setTimestamp();

    targetChannel.send({ content: '@everyone', embeds: [embed] });
    message.reply('Announcement sent!');
  }
};