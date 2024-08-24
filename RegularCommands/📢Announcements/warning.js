const { MessageEmbed, Client, Intents } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'warning',
  description: 'Sends a warning announcement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
      .setColor('ORANGE')
      .setTitle('WARNING: Server Performance')
      .setDescription('**Attention all players!** We have noticed an increase in lag machines and excessive car spawning, which is negatively impacting server performance. Please refrain from creating these as they can cause issues for other players. We appreciate your cooperation in keeping our server running smoothly.')
      .setFooter({ text: 'Repeated offenses may result in penalties.' })
      .setTimestamp();

    targetChannel.send({ content: '@everyone', embeds: [embed] });
    message.reply('Warning announcement sent!');
  }
};