const Discord = require('discord.js');

module.exports = {
  name: 'youtube',
  description: 'Searches for a YouTube video',
  execute(message, args) {
    const name = encodeURIComponent(args.join(' '));
    const link = `https://www.youtube.com/results?search_query=${name}`;

    const embed = new Discord.MessageEmbed()
     .setColor('GREEN')
     .setDescription(`I have found the following for: \`${name}\``)
     .addField(`🔗┇Link`, `[Click here to see the link](${link})`, true);

    message.channel.send({ embeds: [embed] });
  }
};