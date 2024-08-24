const Discord = require("discord.js");

module.exports = {
  name: "timeout",
  description: "Times out a user for a specified amount of time",
  execute(message, args) {
    const perms = message.channel.permissionsFor(message.guild.me);
    if (!perms.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) {
      return message.reply(
        "I don't have the necessary permissions to moderate members!"
      );
    }

    const user = message.mentions.members.first();
    const time = parseInt(args[1]);
    const reason = args.slice(2).join(" ");

    if (!user) return message.reply("Please mention a user to timeout!");
    if (!time) return message.reply("Please specify a time for the timeout!");
    if (!reason) reason = "No reason provided";

    if (user.isCommunicationDisabled())
      return message.reply(`${user} has already been timed out!`);

    user
      .timeout(time * 60 * 1000, reason)
      .then(() => {
        const embed = new Discord.MessageEmbed()
          .setColor("GREEN")
          .setDescription(
            `${user} successfully timed out for **${time} minutes**`
          )
          .addField("💬┆Reason", reason);

        message.channel.send({ embeds: [embed] });
      })
      .catch(() => {
        message.reply(`I can't timeout ${user.tag}`);
      });
  },
};
