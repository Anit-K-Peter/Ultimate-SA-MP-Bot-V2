const { MessageEmbed } = require(`discord.js`);


module.exports = {
  name: 'ping',
  description: 'Replies with the bot\'s latency and API latency.',
  execute: async (message, args) => {
    const sent = Date.now();
    message.channel.send('Pinging...').then((msg) => {
      const latency = Date.now() - sent;
      const apiLatency = message.client.ws.ping;

      const embed = new MessageEmbed()
        .setColor(0x0099ff)
        .setTitle('🏓 Pong!')
        .addFields(
          { name: 'Bot Latency', value: `${latency}ms`, inline: true },
          { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
          { name: 'Uptime', value: formatUptime(message.client.uptime), inline: true }
        )
        .setTimestamp();

      msg.edit({ content: ' ', embeds: [embed] });
    });
  },
};

function formatUptime(ms) {
  const sec = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
  const min = Math.floor((ms / (1000 * 60)) % 60).toString().padStart(2, '0');
  const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
  return `${days}d ${hrs}h ${min}m ${sec}s`;
}