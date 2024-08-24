const { MessageEmbed, Client, Intents } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'deadchat',
  description: 'Sends an deadchat annnouncement message to a specific channel.',
  execute: async (message, args) => {
    const targetChannel = await message.client.channels.fetch(config.channelId);
    
    if (!targetChannel) {
      return message.reply('Channel not found!');
    }

    const embed = new MessageEmbed()
    .setColor('GRAY')
    .setTitle(' Dead Chat: Revival Needed!')
    .setDescription('It looks like our chat has gone quiet! We need your help to revive the conversation! Share your thoughts, ask a question, or just say hello to get the chat started again.')
    .setFooter({ text: 'Let\'s bring the chat back to life!' })
    .setImage('https://media.discordapp.net/attachments/1262375217624252417/1263925466092535858/sleep.gif?ex=669c01d1&is=669ab051&hm=764563f6199788754ca1fc1b46dd713495bb88edee51f68479a387a095089ce8&=')
    .setTimestamp();

      targetChannel.send({ content: '@everyone', embeds: [embed] });
      message.reply('Announcement sent!');
    }
  };