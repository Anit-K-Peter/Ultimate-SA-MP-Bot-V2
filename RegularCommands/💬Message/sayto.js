const { MessageEmbed, TextChannel } = require('discord.js');

module.exports = {
  name: 'sayto',
  description: 'Make bot say message in a specific channel',
  async execute(message, args) {
    // Check if the author has admin role
    if (!message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR')) {
      message.channel.send({ content: 'You do not have permission to make an message.' });
      return;
    }

    // Check if channel mention and announcement message are provided
    if (args.length < 2) {
      message.channel.send({ content: 'Please provide a channel mention and an message.' });
      return;
    }

    // Parse the channel mention from the first argument
    const channelMention = args[0];
    const announcement = args.slice(1).join(' ');

    // Validate the channel mention format
    const channelRegex = /<#(\d+)>/;
    const channelMatch = channelMention.match(channelRegex);
    if (!channelMatch) {
      message.channel.send({ content: 'Invalid channel mention. Please use the format #channel-name.' });
      return;
    }

    const channelId = channelMatch[1];
    const channel = message.guild.channels.cache.get(channelId);

    // Check if channel is a text channel
    if (!(channel instanceof TextChannel)) {
      message.channel.send({ content: 'Please mention a valid text channel.' });
      return;
    }

    // Send the announcement message to the specified channel
    channel.send(announcement)
      .then(() => {
        message.channel.send({ content: `Message successfully sent to ${channel.toString()}.` });
      })
      .catch(error => {
        console.error('Failed to send message:', error);
        message.channel.send({ content: 'Failed to send message. Please try again later.' });
      });
  },
};