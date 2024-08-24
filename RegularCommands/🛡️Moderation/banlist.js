const Discord = require('discord.js');

module.exports = {
  name: 'banlist',
  description: 'Displays the ban list of the server',
  async execute(message, args) {
    // Check if the author has admin role
    if (!message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR')) {
      message.channel.send({ content: 'You do not have permission to make an message.' });
      return;
    }

    message.guild.bans.fetch().then(banned => {
      const list = banned.map(banUser => `${banUser.user.tag}・**Reason:** ${banUser.reason || 'No reason'}`);

      if (list.length === 0) {
        return message.reply(`This server has no bans`);
      }

      const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`🔧・Banlist - ${message.guild.name}`)
        .setDescription(list.join('\n'));

      message.channel.send({ embeds: [embed] });
    }).catch(error => {
      console.error(error);
      message.reply('An error occurred while fetching the ban list!');
    });
  }
};