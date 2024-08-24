const { MessageEmbed, TextChannel } = require('discord.js');

module.exports = {
  name: 'ann',
  description: 'Make an announcement in a specific channel',
  async execute(message, args) {
    // Check if the author has admin role
    if (!message.guild.members.cache.get(message.author.id).permissions.has('ADMINISTRATOR')) {
      message.channel.send({ content: 'You do not have permission to make an message.' });
      return;
    }

    // Check if channel mention and announcement message are provided
    if (args.length < 2) {
      return message.reply({ content: 'Please provide a channel mention and an announcement message.', ephemeral: true });
    }

    // Parse the channel mention from the first argument
    const channelMention = args[0];
    const announcement = args.slice(1).join(' ');

    // Validate the channel mention format
    const channelRegex = /<#(\d+)>/;
    const channelMatch = channelMention.match(channelRegex);
    if (!channelMatch) {
      return message.reply({ content: 'Invalid channel mention. Please use the format #channel-name.', ephemeral: true });
    }

    const channelId = channelMatch[1];
    const channel = message.guild.channels.cache.get(channelId);

    // Check if channel is a text channel
    if (!(channel instanceof TextChannel)) {
      return message.reply({ content: 'Please mention a valid text channel.', ephemeral: true });
    }

    // Get guild's icon URL for thumbnail
    const guildIconUrl = message.guild.iconURL({ dynamic: true, format: 'png', size: 4096 });

    // Create an embed for the announcement
    const announcementEmbed = new MessageEmbed()
      .setTitle('Announcement')
      .setDescription(announcement)
      .setColor('GOLD'); // Discord blue color or any color you prefer

    // Set author to guild's icon and text "From Administrator"
    if (guildIconUrl) {
      announcementEmbed.setAuthor('From Administrator', guildIconUrl);
    } else {
      announcementEmbed.setAuthor('From Administrator');
    }

    if (guildIconUrl) {
      announcementEmbed.setThumbnail(guildIconUrl);
    }

    // Send the announcement embed to the specified channel
    channel.send({ embeds: [announcementEmbed] })
      .then(() => {
        message.reply({ content: `Announcement successfully sent to ${channel.toString()}.`, ephemeral: true });
      })
      .catch(error => {
        console.error('Failed to send announcement:', error);
        message.reply({ content: 'Failed to send announcement. Please try again later.', ephemeral: true });
      });
  },
};
