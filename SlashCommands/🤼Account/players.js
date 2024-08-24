const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const players = require("../../data/players.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("players")
    .setDescription("List all registered players"),
  async execute(interaction) {
    if (players.length === 0) {
      return interaction.reply("No players are registered yet.");
    }

    const embed = new MessageEmbed()
      .setTitle("Registered Players")
      .setColor("#ffffff");

    players.forEach((player) => {
      embed.addFields({
        name: player.name,
        value: `Discord User : <@${player.discordId}>`,
        inline: false,
      });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
