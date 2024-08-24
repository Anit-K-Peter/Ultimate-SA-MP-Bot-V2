const Discord = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Unbans a user from the server',
  execute(message, args) {
    const perms = message.channel.permissionsFor(message.guild.me);
    if (!perms.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) {
      return message.reply('I don\'t have the necessary permissions to ban members!');
    }

    const user = args[0];
    if (!user) {
      return message.reply('Please provide a user ID or mention a user!');
    }

    message.guild.members.unban(user).then(() => {
      const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription('The specified user has been successfully unbanned!')
        .addField('👤┆User', user, true);

      message.channel.send({ embeds: [embed] });
    }).catch(() => {
      message.reply('I could not find the user!');
    });
  }
};