const { MessageEmbed, Client, Intents } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'backup',
  description: 'Sends a backup announcement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
      .setColor('YELLOW')
      .setTitle('BACKUP IN PROGRESS')
      .setDescription('Our system is currently running a backup. Please be patient while we ensure the safety of your data.')
      .setFooter({ text: 'We appreciate your cooperation!' })
      .setTimestamp();

    targetChannel.send({ content: '@everyone', embeds: [embed] });
    message.reply('Announcement sent!');
  }
};