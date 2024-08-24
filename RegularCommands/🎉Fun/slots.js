const Discord = require('discord.js');

const slots = ['🍇', '🍊', '🍐', '🍒', '🍋', '🔔'];

module.exports = {
  name: 'slots',
  description: 'Play a game of slots!',
  aliases: ['slot', 'pin'],
  execute(message) {
    try {
      const random = Math.random();
      let slotOne, slotTwo, slotThree;

      if (random < 0.4) {
        // 40% chance to get all the same slot
        const slot = slots[Math.floor(Math.random() * slots.length)];
        slotOne = slot;
        slotTwo = slot;
        slotThree = slot;
      } else {
        // 60% chance to get random slots
        slotOne = slots[Math.floor(Math.random() * slots.length)];
        slotTwo = slots[Math.floor(Math.random() * slots.length)];
        slotThree = slots[Math.floor(Math.random() * slots.length)];
      }

      message.channel.send(`**Slot Machine**\n${slotOne} | ${slotTwo} | ${slotThree}`);
    } catch (error) {
      console.error(error);
      message.channel.send('Error: Unable to play slots');
    }
  },
};