module.exports = {
    name: 'slap',
    description: 'Slap someone!',
    execute(msg, args) {
      const user = msg.mentions.users.first();
      if (!user) return msg.reply('You need to mention someone to slap!');
      msg.channel.send('Charging up...').then(message => {
        setTimeout(() => {
          message.edit(`_**${msg.author.username}** slaps **${user.username}**._`);
        }, 2000);
      });
    }
  };