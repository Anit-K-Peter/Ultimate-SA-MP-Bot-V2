const Discord = require("discord.js");

module.exports = {
  name: "lockchannel",
  description: "Locks a channel to prevent @everyone from sending messages",
  execute(message, args) {
    const perms = message.channel.permissionsFor(message.guild.me);
    if (!perms.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) {
      return message.reply(
        "I don't have the necessary permissions to manage channels!"
      );
    }

    const channel = message.mentions.channels.first() || message.channel;

    channel.permissionOverwrites.edit(
      message.guild.roles.cache.find((x) => x.name === "@everyone"),
      {
        SEND_MESSAGES: false,
      }
    );

    const embed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription("Channel locked successfully!")
      .addField("📘┆Channel", `${channel} (${channel.name})`);

    message.channel.send({ embeds: [embed] });
  },
};
