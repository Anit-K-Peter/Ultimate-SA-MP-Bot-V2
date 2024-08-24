const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apply')
    .setDescription('Apply with your in-game name')
    .addStringOption(option =>
      option.setName('ingame_name')
        .setDescription('Your in-game name in the format Firstname_Secondname')
        .setRequired(true)),
  async execute(interaction) {
    const member = interaction.member;
    const guildId = interaction.guildId;
    const user = interaction.user;
    const options = interaction.options;
    const ingameName = options.getString('ingame_name');

    if (!member.roles.cache.has(config.unwhitelistRoleId) || member.roles.cache.has(config.whitelistRoleId)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    if (!/^[A-Z][a-z]*_[A-Z][a-z]*$/.test(ingameName)) {
      return interaction.reply({ content: 'Please provide your in-game name in the format Firstname_Secondname.', ephemeral: true });
    }

    // Create Embed message with buttons
    const embed = new MessageEmbed()
      .setTitle('New Application')
      .setDescription(`In-game Name: ${ingameName}`)
      .setColor('#00FF00')
      .setTimestamp();

    // Define action buttons
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('accept')
          .setLabel('Name Accepted')
          .setStyle('SUCCESS'),
        new MessageButton()
          .setCustomId('whitelist')
          .setLabel('Whitelisted')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('reject')
          .setLabel('Rejected')
          .setStyle('DANGER')
      );

    // Send Embed message with action buttons to Response Channel
    const responseChannel = interaction.client.channels.cache.get(config.responseChannelId);
    if (responseChannel) {
      const message = await responseChannel.send({ embeds: [embed], components: [row] });

      // Handle button interactions
      const filter = i => i.user.id === interaction.user.id;
      const collector = message.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async interaction => {
        const { customId } = interaction;

        if (customId === 'accept') {
          // Remove unwhitelisted role
          await member.roles.remove(config.unwhitelistRoleId);
          // Add whitelisted role
          await member.roles.add(config.whitelistRoleId);
          // DM user
          await interaction.user.send('You have been whitelisted!');
          // Update embed
          embed.setDescription(`${ingameName} has been accepted and whitelisted.`);
          embed.setColor('#32a852');
          await message.edit({ embeds: [embed], components: [] });
        } else if (customId === 'whitelist') {
          // Add whitelisted role
          await member.roles.add(config.whitelistRoleId);
          // DM user
          await interaction.user.send('You have been whitelisted!');
          // Update embed
          embed.setDescription(`${ingameName} has been whitelisted.`);
          embed.setColor('#32a852');
          await message.edit({ embeds: [embed], components: [] });
        } else if (customId === 'reject') {
          // DM user
          await interaction.user.send('Your application has been rejected.');
          // Update embed
          embed.setDescription(`${ingameName}'s application has been rejected.`);
          embed.setColor('#ff3333');
          await message.edit({ embeds: [embed], components: [] });
        }

        // Disable further interaction with the buttons
        collector.stop();
      });

      collector.on('end', () => {
        if (message.components.length > 0) {
          message.edit({ components: [] });
        }
      });
    }

    // Reply to user indicating successful submission
    return interaction.reply({ content: 'Your application has been submitted!', ephemeral: true });
  },
};