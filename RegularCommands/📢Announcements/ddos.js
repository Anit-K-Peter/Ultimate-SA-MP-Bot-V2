const { MessageEmbed, Client, Intents } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'ddosalert',
  description: 'Sends a warning message about a DDoS attack.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle('DDoS ATTACK WARNING!')
      .setDescription('Our servers are under attack! Be cautious of your online activities and avoid sharing sensitive information. We\'re working to mitigate the attack and restore normal operations.')
      .setFooter({ text: 'Stay safe and stay vigilant!' })
      .setImage('https://media.discordapp.net/attachments/1262375217624252417/1263925466092535858/alert.gif?ex=669c01d1&is=669ab051&hm=764563f6199788754ca1fc1b46dd713495bb88edee51f68479a387a095089ce8&=')
      .setTimestamp();

    targetChannel.send({ content: '@everyone', embeds: [embed] });
    message.reply('Warning sent!');
  }
};