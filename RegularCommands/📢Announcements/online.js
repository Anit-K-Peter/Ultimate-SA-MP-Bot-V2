const { MessageEmbed, Client, Intents } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'online',
  description: 'Sends an Online annnouncement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('🟢Server Online ')
      .setDescription('server is now back online and ready for action! Dive back into your GTA San World and enjoy the improved experience. Thank you for your patience and continued support!')
      embed.setFooter({ text: 'We appreciate your patience and support.' })
      .setImage('https://cdn.discordapp.com/attachments/1262375217624252417/1263925465710727168/standard_2.gif?ex=669c01d1&is=669ab051&hm=6482b36a33f7f7e9305740b96cda9137fd284feb86185456db541929297eb367&')
      .setTimestamp();

      targetChannel.send({ content: '@everyone', embeds: [embed] });
      message.reply('Announcement sent!');
    }
  };