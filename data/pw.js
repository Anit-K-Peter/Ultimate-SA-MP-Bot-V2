const { status, botName, Text, version, startTime, gradient } = require('../config.ecosystem');

function printWatermark() {
  const uptimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

  // Calculating uptime percentage over an arbitrary max value, assuming 100000 seconds as full uptime
  const uptimePercentage = Math.min(uptimeInSeconds / 100000, 1); 
  const colorIndex = Math.floor(uptimePercentage * (gradient.length - 1));
  const color = gradient[colorIndex];

  console.log(`${color}\x1b[1m╔═══════════════════════════════════════╗`);
  console.log(`${color}\x1b[1m║                                       ║`);
  console.log(`${color}\x1b[1m║     🤖 Bot Name : ${botName}         `);
  console.log(`${color}\x1b[1m║     👑 Authorization : ${status}     `);
  console.log(`${color}\x1b[1m║     💡 Version : ${version}          `);
  console.log(`${color}\x1b[1m║     📅 Uptime : ${uptimeInSeconds}s  `);
  console.log(`${color}\x1b[1m║     🚀 Powered by ${Text}           `);
  console.log(`${color}\x1b[1m║                                       ║`);
console.log(`${color}\x1b[1m╚═══════════════════════════════════════╝\x1b[0m`);
}

module.exports = {
  printWatermark,
};
