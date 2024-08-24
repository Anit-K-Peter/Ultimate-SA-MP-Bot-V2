const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const teamsPath = path.join(__dirname, "../../data/teams.json");
let teamsData;

try {
    teamsData = JSON.parse(fs.readFileSync(teamsPath, "utf8"));
} catch (error) {
    console.error("Error reading teams.json:", error);
    teamsData = {};
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("teamroster")
        .setDescription("Get team roster from available gangs")
        .addStringOption((option) =>
            option
                .setName("team")
                .setDescription("Select a team")
                .setRequired(true)
                .addChoices(...Object.keys(teamsData).map((teamName) => ({ name: teamName, value: teamName }))),
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply(); // Defer reply to acknowledge the interaction

            const teamName = interaction.options.getString("team");

            const team = teamsData[teamName];

            if (!team) {
                await interaction.editReply("Invalid team selection.");
                return;
            }

            // Construct embed with the team details
            const embed = new MessageEmbed()
                .setTitle(`Team Details for ${teamName}`)
                .setDescription(`**Alias:** ${team.alias}\n**Boss:** <@${team.boss}>\n**Color:** ${team.color}\n**Skin:** ${team.skin}\n**Color Name:** ${team.colorName}`)
                .setColor(team.color)
                .setThumbnail(`https://example.com/${team.skin}.png`); // Replace with the actual image URL

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error executing teamroster command:", error);
            await interaction.editReply(
                "There was an error while executing this command."
            );
        }
    },
};