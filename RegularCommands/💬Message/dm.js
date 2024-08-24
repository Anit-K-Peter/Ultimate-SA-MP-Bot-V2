module.exports = {
  name: 'dm',
  description: 'Send a direct message to a user',
  async execute(message, args) {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      return message.reply('You do not have permission to send direct messages.');
    }

    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) return message.reply('You must mention a user.');

    const dmMessage = args.slice(1).join(' ');
    if (!dmMessage) return message.reply('You must provide a message to send.');

    mentionedUser.send(dmMessage)
      .then(() => message.reply(`DM sent to ${mentionedUser.username} successfully!`))
      .catch(() => message.reply('Failed to send DM.'));
  }
};