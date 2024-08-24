const { MessageEmbed } = require('discord.js');
const config = require('../../config.nes.js');

module.exports = {
  name: 'verify',
  description: 'verify for a role',
  execute(message, args) {
    const role = message.guild.roles.cache.get(config.roleId);
    const channel = message.guild.channels.cache.get(config.channelIdd);
    const removeRole = message.guild.roles.cache.get(config.removeRoleId);
    const member = message.guild.members.cache.get(message.author.id);

    if (!role) {
      message.reply('Role not found!');
      return;
    }

    if (!channel) {
      message.reply('Channel not found!');
      return;
    }

    if (!removeRole) {
      message.reply('Remove role not found!');
      return;
    }

    if (member.roles.cache.has(config.roleId)) {
      message.delete();
      const embed = new MessageEmbed()
        .setDescription(`You are already verified!`);
      channel.send({ embeds: [embed] }); // Remove message_reference
    } else {
      try {
        member.roles.add(role);
        member.roles.remove(removeRole);
        const embed = new MessageEmbed()
          .setDescription(`Your account has been Whitelisted in discord <:emoji_2:1252452194989506682>\n\n@${message.author.username}`)
        message.delete();
        channel.send(`**${member.user.username}** has been whitelisted!`);
        message.author.send(`You have been given the ${role.name} role!`);
      } catch (error) {
        console.error('Error verifing member:', error);
        message.reply('There was an error while processing your request.');
      }
    }
  },
};