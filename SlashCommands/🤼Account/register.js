const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  Modal,
  TextInputComponent,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const players = require("../../data/players.js");
const fs = require("fs");
const config = require("../../config.nes.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register a player"),
  async execute(interaction) {
    // Check if the user is already registered
    if (players.some((player) => player.discordId === interaction.user.id)) {
      return interaction.reply("You are already registered.");
    }

    // Create an embed for the registration form
    const embed = new MessageEmbed()
      .setTitle("Player Registration Panel")
      .setDescription(
        "Select an option from the dropdown below to open the registration form Panel."
      )
      .setColor("#66ff33");

    // Create a dropdown to open the registration form
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("register_form_select")
        .setPlaceholder("Select an option")
        .addOptions([
          {
            label: "Register",
            description: "Open the registration form",
            value: "register",
          },
        ])
    );

    // Send the embed with the dropdown
    await interaction.reply({ embeds: [embed], components: [row] });

    // Event listener for dropdown interaction
    interaction.client.on("interactionCreate", async (interaction) => {
      if (
        interaction.isSelectMenu() &&
        interaction.customId === "register_form_select"
      ) {
        if (interaction.values[0] === "register") {
          // Create a modal for the registration form
          const modal = new Modal()
            .setCustomId("register_form")
            .setTitle("Register Player Panel");

          const nameInput = new TextInputComponent()
            .setCustomId("name")
            .setLabel("Player Name")
            .setStyle("SHORT")
            .setRequired(true);

          const skinIdInput = new TextInputComponent()
            .setCustomId("skinId")
            .setLabel("Skin ID")
            .setStyle("SHORT")
            .setRequired(true);

          const serverNameInput = new TextInputComponent()
            .setCustomId("serverName")
            .setLabel("Server Name")
            .setStyle("SHORT")
            .setRequired(true);

          const privateInput = new TextInputComponent()
            .setCustomId("private")
            .setLabel("Private Account? (Yes/No)")
            .setStyle("SHORT")
            .setRequired(true);

          modal.addComponents(
            new MessageActionRow().addComponents(nameInput),
            new MessageActionRow().addComponents(skinIdInput),
            new MessageActionRow().addComponents(serverNameInput),
            new MessageActionRow().addComponents(privateInput)
          );

          // Show the modal to the user
          await interaction.showModal(modal);
        }
      } else if (
        interaction.isModalSubmit() &&
        interaction.customId === "register_form"
      ) {
        // Handle the modal submission
        const name = interaction.fields.getTextInputValue("name");
        const skinId = interaction.fields.getTextInputValue("skinId");
        const serverName = interaction.fields.getTextInputValue("serverName");
        const isPrivate = interaction.fields.getTextInputValue("private");

        const player = {
          name: name,
          discordId: interaction.user.id,
          discordTag: interaction.user.tag,
          skinId: skinId,
          serverName: serverName,
          private: isPrivate.toLowerCase() === "yes",
        };

        players.push(player);
        fs.writeFileSync(
          "./data/players.js",
          `module.exports = ${JSON.stringify(players, null, 4)};`
        );

        await interaction.reply({
          content: "Player registered successfully!",
          ephemeral: true,
        });

        // Send registration details to the specific channel
        const channelId = config.registrationChannelId;
        const channel = await interaction.client.channels.fetch(channelId);

        if (channel) {
          const registerEmbed = new MessageEmbed()
            .setTitle("New Player Registration")
            .setDescription("A new player has registered!")
            .addFields(
              { name: "Name", value: player.name, inline: true },
              { name: "Discord ID", value: player.discordId, inline: true },
              { name: "Discord Tag", value: player.discordTag, inline: true },
              { name: "Skin ID", value: player.skinId, inline: true },
              { name: "Server Name", value: player.serverName, inline: true },
              {
                name: "Private Account",
                value: player.private ? "Yes" : "No",
                inline: true,
              }
            )
            .setColor("#00FF00");

          await channel.send({ embeds: [registerEmbed] });
        } else {
          console.error(`Channel with ID ${channelId} not found.`);
        }
      }
    });
  },
};
