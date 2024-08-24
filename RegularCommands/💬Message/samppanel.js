const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
  name: "samppaanel",
  description: "Sends an sampapanel message with buttons.",
  execute: async (interaction) => {
    const embed = new MessageEmbed()
      .setColor(0xff0000) // Red color
      .setTitle("Samp Panel")
      .setDescription("This is an Samp Panel")
      .setTimestamp();

    const startButton = new MessageButton()
      .setCustomId("start")
      .setLabel("Start")
      .setStyle("SUCCESS");

    const stopButton = new MessageButton()
      .setCustomId("stop")
      .setLabel("Stop")
      .setStyle("DANGER");

    const pauseButton = new MessageButton()
      .setCustomId("pause")
      .setLabel("Pause")
      .setStyle("PRIMARY");

    const cancelButton = new MessageButton()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle("SECONDARY");

    const row = {
      type: 1,
      components: [startButton, stopButton, pauseButton, cancelButton],
    };

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};

// Button interaction handler
module.exports.buttonInteraction = async (interaction) => {
  if (!interaction.isButton()) return;

  const customId = interaction.customId;
  const embed = interaction.message.embeds[0];

  switch (customId) {
    case "start":
      embed.setDescription("Started! LOL");
      break;
    case "stop":
      embed.setDescription("Stopped! LOL");
      break;
    case "pause":
      embed.setDescription("Paused! LOL");
      break;
    case "cancel":
      embed.setDescription("Canceled! LOL");
      break;
  }

  await interaction.update({ embeds: [embed], components: [] });
  await interaction.reply({ content: "Button clicked!", ephemeral: true });
};
