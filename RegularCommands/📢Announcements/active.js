const { MessageEmbed } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'activechat',
  description: 'Sends an active chat announcement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('Chat is POPPING!')
      .setDescription('The conversation is flowing! Join in on the fun and share your thoughts, ask questions, or just hang out with the community!')
      .setFooter({ text: 'Let\'s keep the energy high!' })
      .setImage('https://media.discordapp.net/attachments/1262375217624252417/1263925466092535858/party.gif?ex=669c01d1&is=669ab051&hm=764563f6199788754ca1fc1b46dd713495bb88edee51f68479a387a095089ce8&=')
      .setTimestamp();

    targetChannel.send({ content: '@everyone', embeds: [embed] });
    message.reply('Announcement sent!');
  }
};