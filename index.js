const fs = require("fs");
const path = require("path");
const {
  Client,
  Collection,
  Intents,
  MessageEmbed,
  ActivityType,
} = require("discord.js");
const { token, clientId, guildId, prefix } = require("./config");
const { REST } = require("@discordjs/rest");
const { printWatermark } = require("./data/pw.js");
const { Routes } = require("discord-api-types/v9");
const { fetchServerInfo } = require("./data/fetchServerInfo");
const { welcomeChannelId, verifyChannelId, faqChannelId, welcomeImage } = require('./config.nes.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.slashCommands = new Collection();
client.nonSlashCommands = new Collection();

// Load slash commands
const slashCommandsPath = path.join(__dirname, "SlashCommands");
const slashCommandFiles = [];

function readSlashDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      readSlashDir(filePath);
    } else if (file.endsWith(".js")) {
      slashCommandFiles.push(filePath);
    }
  }
}

readSlashDir(slashCommandsPath);

for (const file of slashCommandFiles) {
  const command = require(file);
  client.slashCommands.set(command.data.name, command);
}

// Load non-slash commands
const nonSlashCommandsPath = path.join(__dirname, "RegularCommands");
const nonSlashCommandFiles = [];

function readNonSlashDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      readNonSlashDir(filePath);
    } else if (file.endsWith(".js")) {
      nonSlashCommandFiles.push(filePath);
    }
  });
}

readNonSlashDir(nonSlashCommandsPath);

for (const file of nonSlashCommandFiles) {
  const command = require(file);
  client.nonSlashCommands.set(command.name, command);
}

let playerCount = 0;

function welcomeMessage() {
  client.on("guildMemberAdd", async (member) => {
    const guild = member.guild;
    const channel = guild.channels.cache.find((channel) => channel.id === welcomeChannelId);
    if (!channel) {
      console.error(`Channel not found: ${welcomeChannelId}`);
      return;
    }

    const embed = new MessageEmbed()
      .setTitle("*Welcome to Vedipura*")
      .setDescription(`Reached ${guild.memberCount} Members\nVerify at : <#${verifyChannelId}>`)
      .setImage(welcomeImage);

    try {
      await channel.send(`Welcome <@${member.id}>!`);
      await channel.send({ embeds: [embed] }); // Send the embed in a separate message
    } catch (error) {
      console.error(`Error sending welcome message: ${error}`);
    }
  });
}

function refreshSlashCommands() {
  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      const rest = new REST({ version: "9" }).setToken(token);
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: client.slashCommands.map((command) => command.data),
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error("Error refreshing application (/) commands:", error);
    }
  })();
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Fetch server info
  const serverInfo = await fetchServerInfo();

  if (serverInfo) {
    playerCount = serverInfo.playersOnline;
    client.user.setActivity(`${playerCount} players...`, { type: "WATCHING" });
  } else {
    client.user.setActivity("Error fetching server info", { type: "PLAYING" });
  }

  console.log("---------------------Slash Commands:---------------------");
  client.slashCommands.forEach((command) =>
    console.log(`- ${command.data.name}`)
  );
  console.log("---------------------Non-Slash Commands:---------------------");
  client.nonSlashCommands.forEach((command) =>
    console.log(`- ${command.name}`)
  );

  welcomeMessage();
  refreshSlashCommands();
  printWatermark();

  // Refresh activity every 3 minutes
  let activities = [
    { type: "WATCHING", text: `${playerCount} players...` },
    { type: "WATCHING", text: "/911" },
    { type: "WATCHING", text: "Vedipura" },
    { type: "WATCHING", text: "Top Players" },
  ];
  let activityIndex = 0;

  setInterval(async () => {
    const serverInfo = await fetchServerInfo();

    if (serverInfo) {
      playerCount = serverInfo.playersOnline;
      client.user.setActivity(`${playerCount} players...`, {
        type: "WATCHING",
      });
    } else {
      client.user.setActivity("Error fetching server info", {
        type: "PLAYING",
      });
    }
  }, 180000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  if (message.channel.id === faqChannelId) {
    const faq = require("./data/faq.json");
    const question = message.content.toLowerCase();

    for (const [key, value] of Object.entries(faq)) {
      if (question === key) {
        // exact match
        message.reply(value);
        return;
      }
    }
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.nonSlashCommands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    await message.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
