const { MessageEmbed, MessageButton, MessageActionRow, Modal, TextInputComponent, showModal } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.nes'); // Load config.json file

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("whitelist for a role")
    .addStringOption((option) =>
      option
        .setName("ingame_name")
        .setDescription("Your in-game name in the format Firstname_Secondname")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.whitelistRoleId)) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    const verificationCode = generateRandomCode();

    try {
      // Send code via DM
      await interaction.user.send({
        content: `Your verification code is: ${verificationCode}`,
      });
      await interaction.reply({
        content:
          "A verification code has been sent to your DM. Please check your messages.",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error sending DM:", error);
      await interaction.reply({
        content:
          "An error occurred while sending the verification code. Please make sure your DMs are open.",
        ephemeral: true,
      });
      return;
    }

    // Send embed with instructions and button to verify
    const embed = new MessageEmbed()
      .setTitle("Verification Code")
      .setDescription(
        "A verification code has been sent to your DM. Please enter the code here."
      )
      .setEphemeral(true);

    const button = new MessageButton()
      .setCustomId("verify_code")
      .setLabel("Verify Code")
      .setStyle("PRIMARY");

    const row = new MessageActionRow().addComponents(button);

    const sentMessage = await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });

    // Create a collector for the button interaction
    const filter = (i) =>
      i.customId === "verify_code" && i.user.id === interaction.user.id;
    const collector = sentMessage.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (buttonInteraction) => {
      // Create and show the modal
      const modal = new Modal()
        .setCustomId("verify_modal")
        .setTitle("Enter Verification Code");

      const input = new TextInputComponent()
        .setCustomId("verification_code")
        .setLabel("Verification Code")
        .setStyle("SHORT")
        .setRequired(true);

      const actionRow = new MessageActionRow().addComponents(input);

      modal.addComponents(actionRow);

      await showModal(modal, {
        client: interaction.client,
        interaction: buttonInteraction,
      });
    });

    collector.on("end", async () => {
      try {
        await sentMessage.edit({ components: [] }); // Remove the button after interaction ends
      } catch (error) {
        if (error.code === 10008) {
          console.log("Message not found, skipping edit");
        } else {
          console.error("Error editing message:", error);
        }
      }
    });

    // Use a separate event listener for modal submissions
    interaction.client.on("interactionCreate", async (modalInteraction) => {
      if (
        !modalInteraction.isModalSubmit() ||
        modalInteraction.customId !== "verify_modal"
      )
        return;

      const typedCode = modalInteraction.fields
        .getTextInputValue("verification_code")
        .trim();
      if (typedCode === verificationCode) {
        const roleId = config.verifiedRoleId; // Replace with the verified role ID from config.json
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) {
          await modalInteraction.reply({
            content: "Role not found. Please contact an administrator.",
            ephemeral: true,
          });
          return;
        }
        const member = interaction.guild.members.cache.get(interaction.user.id);
        await member.roles.add(role);
        await member.roles.remove(config.whitelistRoleId); // Remove the whitelist role after verification
        await modalInteraction.reply({
          content: "You have been verified and granted the role!",
          ephemeral: true,
        });

        // Delete the original verification message
        try {
          await sentMessage.delete();
        } catch (error) {
          if (error.code === 10008) {
            console.log("Message not found, skipping delete");
          } else {
            console.error("Error deleting message:", error);
          }
        }
      } else {
        await modalInteraction.reply({
          content: "Incorrect code. Please try again.",
          ephemeral: true,
        });
      }
    });
  },
};

function generateRandomCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}