const Discord = require('discord.js');

module.exports = {
  name: 'ownerinfo',
  description: 'Displays information about the bot owner',
  execute(message, args) {
    const embed = new Discord.MessageEmbed()
      .setTitle('📘・Owner information')
      .setDescription('____________________________')
      .setThumbnail(message.client.user.avatarURL({ dynamic: true, size: 1024 }))
      .addField('👑┆Owner name', 'Sebastian_Varkey', false)
      .addField('🏷┆Discord tag', 'spike_barbie', false)
      .addField('🏢┆Organization', 'Mortex', false)

    message.channel.send({ embeds: [embed] });
  }
};