const { MessageEmbed, Client, Intents } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'restarting',
  description: 'Sends an restarting annnouncement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
      .setColor('YELLOW')
      .setTitle('⚙ Server Restarting ')
      .setDescription('The server is restarting and will be back online shortly. Get ready to dive back into your GTA San World for an improved experience. Thank you for your patience and continued support!')
      embed.setFooter({ text: 'We appreciate your patience and support.' })
      .setImage('https://cdn.discordapp.com/attachments/1262375217624252417/1264212933961973891/standard_3.gif?ex=669d0d8b&is=669bbc0b&hm=20cdc89a646fe484e980006d3f478c2c37adaee34f339aad5562ee00394d5464&')
      .setTimestamp();

      targetChannel.send({ content: '@everyone', embeds: [embed] });
      message.reply('Announcement sent!');
    }
  };