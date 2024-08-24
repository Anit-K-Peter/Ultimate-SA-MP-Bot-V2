const { MessageEmbed } = require('discord.js');
const os = require('os');

module.exports = {
  name: 'botinfo',
  description: 'Displays information about the Vedipura Bot.',
  execute(message) {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usedMemoryMB = (usedMemory / 1024 / 1024).toFixed(2);
    const totalMemoryMB = (totalMemory / 1024 / 1024).toFixed(2);

    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);
    const formattedUptime = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

    const totalServers = message.client.guilds.cache.size;
    const totalUsers = message.client.users.cache.size;
    const latency = Math.round(message.client.ws.ping);

    const embed = new MessageEmbed()
      .setTitle('Vedipura Bot')
      .setDescription(`The Vedipura Bot is the most highly efficient bot and multipurpose bot made by a developer.\n\n**Information**\n<a:smoji_15:1269297893735530526>Developer: Sebastian\n<a:smoji_15:1269297893735530526>Node.js: 18.0.6\n<a:smoji_15:1269297893735530526>Uptime: ${formattedUptime}\n\n**Statistics**\n<a:smoji_15:1269297893735530526>Servers: ${totalServers} servers\n<a:smoji_15:1269297893735530526>Users: ${totalUsers} users\n<a:smoji_15:1269297893735530526>Ram Usage: ${usedMemoryMB} MB / ${totalMemoryMB} MB\n<a:smoji_15:1269297893735530526>Latency: ${latency}ms\n\n**Links**\n<a:smoji_15:1269297893735530526>Support Server: [Link to support server]\n<a:smoji_15:1269297893735530526>Vote: [Link to vote]`)
      .setColor('#000012')
      .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }));

    try {
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending bot information:', error);
      message.reply('Failed to send bot information. Ensure the bot has the necessary permissions.');
    }
  },
};