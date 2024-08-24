module.exports = {
    name: 'bite',
    description: 'Bite someone!',
    execute(msg, args) {
      const user = msg.mentions.users.first();
      if (!user) return msg.reply('You need to mention someone to bite!');
      msg.channel.send('Loading bite...').then(message => {
        setTimeout(() => {
          message.edit(`_**${msg.author.username}** bites **${user.username}**._`);
        }, 2000);
      });
    }
  };