module.exports = {
    name: 'hug',
    description: 'Hug someone!',
    execute(msg, args) {
      const user = msg.mentions.users.first();
      if (!user) return msg.reply('You need to mention someone to hug!');
      msg.channel.send('Wrapping arms around...').then(message => {
        setTimeout(() => {
          message.edit(`_**${msg.author.username}** hugs **${user.username}**._`);
        }, 2000);
      });
    }
  };