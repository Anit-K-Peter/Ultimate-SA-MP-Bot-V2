const Discord = require('discord.js');

module.exports = {
  name: 'unlockchannel',
  description: 'Unlocks a channel to allow @everyone to send messages',
  execute(message, args) {
    const perms = message.channel.permissionsFor(message.guild.me);
    if (!perms.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) {
      return message.reply('I don\'t have the necessary permissions to manage channels!');
    }

    const channel = message.mentions.channels.first() || message.channel;

    channel.permissionOverwrites.edit(message.guild.roles.cache.find(x => x.name === '@everyone'), {
      SEND_MESSAGES: true,
    });

    const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription('Channel unlocked successfully!')
      .addField('📘┆Channel', `${channel} (${channel.name})`);

    message.channel.send({ embeds: [embed] });
  }
};