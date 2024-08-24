const fs = require('fs');
const { fetchServerInfo } = require('../../data/fetchServerInfo');

module.exports = {
  name: 'setchannel',
  description: 'Creates a channel displaying the number of online players and updates it every 1 minute.',
  async execute(message, args) {
    // Check if the author has admin role
    if (!message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR')) {
      message.channel.send({ content: 'You do not have permission to make an message.' });
      return;
    }

    const guild = message.guild;

    // Check if the channel already exists
    let channel = guild.channels.cache.find(channel => channel.name.startsWith('Online Players'));
    if (!channel) {
      try {
        channel = await guild.channels.create('Online Players: 0', {
          type: 'GUILD_VOICE',
          permissionOverwrites: [
            {
              id: guild.id,
              deny: ['CONNECT'],
            },
          ],
        });

        // Save channel ID to guildchannel.json
        const channelData = {
          channelId: channel.id,
        };
        fs.writeFileSync('./data/guildchannel.json', JSON.stringify(channelData));

        message.channel.send(`Channel ${channel.name} created.`);
      } catch (error) {
        console.error('Error creating channel:', error);
        message.channel.send('There was an error creating the channel.');
        return;
      }
    } else {
      // Update channel ID in guildchannel.json if channel already exists
      const channelData = {
        channelId: channel.id,
      };
      fs.writeFileSync('./data/guildchannel.json', JSON.stringify(channelData));

      message.channel.send(`Channel ${channel.name} already exists.`);
    }

    // Function to update the channel name
    const updateChannelName = async () => {
      const serverInfo = await fetchServerInfo();
      if (serverInfo && serverInfo.playersOnline !== undefined) {
        try {
          await channel.setName(`Online Players: ${serverInfo.playersOnline}`);
        } catch (error) {
          console.error('Error updating channel name:', error);
        }
      } else {
        console.error('Failed to fetch player count for updating channel name.');
      }
    };

    // Initial update
    await updateChannelName();

    // Update the channel name every 1 minute (60000 milliseconds)
    setInterval(updateChannelName, 1 * 60 * 1000);
  },
};