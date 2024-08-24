const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
  name: 'sendverify',
  description: 'Send a verification message to a channel',
  execute(message, args) {
    const channelId = config.verificationChannelId;
    const roleId1 = config.roleId1;
    const roleId2 = config.roleId2;
    const emoji = config.verificationEmoji;
    const logChannelId = config.logChannelId;

    const channel = message.guild.channels.cache.get(channelId);
    if (!channel) {
      message.reply('Channel not found!');
      return;
    }

    const role1 = message.guild.roles.cache.get(roleId1);
    const role2 = message.guild.roles.cache.get(roleId2);
    if (!role1 || !role2) {
      message.reply('One or both roles not found!');
      return;
    }

    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      message.reply('Log channel not found!');
      return;
    }

    const embed = new MessageEmbed()
      .setDescription(`To Get verified Just React with ${emoji} to get verified to Vedipura: ${emoji}:`);

    channel.send({ embeds: [embed] }).then(sentMessage => {
      sentMessage.react(emoji); // React with the actual emoji character

      const filter = (reaction, user) => reaction.emoji.name === emoji && !user.bot;
      const collector = sentMessage.createReactionCollector({ filter, time: 0 });

      collector.on('collect', (reaction, user) => {
        const member = message.guild.members.cache.get(user.id);
        member.roles.add(role1);
        member.roles.add(role2);

        // Send a log message to the specified channel
        const logEmbed = new MessageEmbed()
          .setTitle('New User Verified')
          .setDescription(`**${member.user.tag}** has been verified!`)
          .setColor('GREEN');
        logChannel.send({ embeds: [logEmbed] });
      });

      // Write the message ID, link, and channel ID to ./data/verification.json
      const verificationData = {
        messageId: sentMessage.id,
        messageLink: sentMessage.url,
        channelId: channelId,
        roleId1: roleId1,
        roleId2: roleId2,
        emoji: emoji,
        logChannelId: logChannelId,
      };

      fs.writeFileSync('./data/verification.json', JSON.stringify(verificationData, null, 2));
    });
  },
};