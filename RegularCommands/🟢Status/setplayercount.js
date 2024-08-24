const { fetchServerInfo } = require("../../data/fetchServerInfo");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs").promises;
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

module.exports = {
  name: "setguildv5",
  description:
    "Sets the server info message in the specified channel and updates it every 5 minutes.",
  async execute(message, args) {
    try {
      const channelMention = message.mentions.channels.first();
      if (!channelMention) {
        return message.reply(
          "Please mention a channel to set the server info message."
        );
      }

      const channel = channelMention;

      const serverInfo = await fetchServerInfo();
      if (!serverInfo) {
        return message.reply(
          "Failed to fetch server information. Please try again later."
        );
      }

      const serverName =
        typeof serverInfo.serverName === "string"
          ? serverInfo.serverName
          : "Server Name";

      let playersList = "no players";
      if (serverInfo.players && serverInfo.players.length > 0) {
        playersList = serverInfo.players
          .map(
            (player, index) =>
              `${index + 1}. ${player.playerName} (Score: ${
                player.score
              }, Ping: ${player.ping})`
          )
          .join("\n");
      }

      const embedMessage = new MessageEmbed()
        .setColor("#0000FF")
        .setTitle(serverName)
        .addFields(
          {
            name: "Server Players",
            value: `\`${serverInfo.status}\``,
            inline: true,
          },
          {
            name: "Connection Info",
            value: `\`${serverInfo.ipPort}\``,
            inline: true,
          },
          {
            name: "Current Map",
            value: `\`${serverInfo.location}\``,
            inline: false,
          },
          {
            name: "Players List:",
            value: `\`\`\`${playersList}\`\`\``,
            inline: false,
          }
        )
        .setFooter({
          text: "Status By Mortex Crew",
        });

      const button = new MessageButton()
        .setLabel("Update")
        .setEmoji("🔄")
        .setStyle("PRIMARY")
        .setCustomId("update-button");

      const row = new MessageActionRow().addComponents(button);

      const sentMessage = await channel.send({
        embeds: [embedMessage],
        components: [row],
      });

      const guildMessageData = {
        channelId: channel.id,
        messageId: sentMessage.id,
      };
      await fs.writeFile(
        "./data/guildmessagev2.json",
        JSON.stringify(guildMessageData)
      );

      message.channel.send(`Server info message set in ${channel}.`);

      const updateMessage = async () => {
        try {
          const serverInfoUpdate = await fetchServerInfo();
          if (!serverInfoUpdate) {
            console.error("Failed to fetch server information for update.");
            return;
          }

          const serverName =
            typeof serverInfoUpdate.serverName === "string"
              ? serverInfoUpdate.serverName
              : "Server Name";

          let playersListUpdate = "no players";
          if (serverInfoUpdate.players && serverInfoUpdate.players.length > 0) {
            playersListUpdate = serverInfoUpdate.players
              .map(
                (player, index) =>
                  `${index + 1}. ${player.playerName} (Score: ${
                    player.score
                  }, Ping: ${player.ping})`
              )
              .join("\n");
          }

          const embedUpdate = new MessageEmbed()
            .setColor("#0000FF")
            .setTitle(serverName)
            .addFields(
              {
                name: "Server Players",
                value: `\`${serverInfoUpdate.status}\``,
                inline: true,
              },
              {
                name: "Connection Info",
                value: `\`${serverInfoUpdate.ipPort}\``,
                inline: true,
              },
              {
                name: "Current Map",
                value: `\`${serverInfoUpdate.location}\``,
                inline: false,
              },
              {
                name: "Players List:",
                value: `\`\`\`${playersListUpdate}\`\`\``,
                inline: false,
              }
            )
            .setFooter({
              text: "Status By Mortex Crew",
            });

          const guildMessageData = JSON.parse(
            await fs.readFile("./data/guildmessagev2.json", "utf8")
          );
          const updateChannel = message.client.channels.cache.get(
            guildMessageData.channelId
          );
          const updateMessage = updateChannel.messages.cache.get(
            guildMessageData.messageId
          );

          await updateMessage.edit({
            embeds: [embedUpdate],
          });
        } catch (error) {
          console.error("Error updating message:", error);
        }
      };

      await updateMessage();

      setInterval(updateMessage, UPDATE_INTERVAL);

      // Add event listener for button click
      const filter = (interaction) => interaction.customId === button.customId;
      const collector = sentMessage.createMessageComponentCollector(filter);

      collector.on("collect", async (interaction) => {
        if (interaction.customId === button.customId) {
          await interaction.deferReply();
          await updateMessage();
          interaction.editReply({
            content: `Thank you, ${interaction.user.username}, for keeping the server info up to date!`,
            ephemeral: true,
          });
        }
      });
    } catch (error) {
      console.error("Error setting server info message:", error);
      message.channel.send(
        "Failed to set server info message. Please try again later."
      );
    }
  },
};