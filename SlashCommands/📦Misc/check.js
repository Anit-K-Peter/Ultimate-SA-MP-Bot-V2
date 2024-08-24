const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mainConfig = require('../../config.js');
const additionalConfig = require('../../config.nes.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('Check setup information'),

  async execute(interaction) {
    const checkEmbed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle('🔍 Setup Information')
      .addFields(
        { name: 'Response Channel', value: `<#${mainConfig.responseChannelId}>`, inline: true },
        { name: 'Command Usage Channel', value: `<#${mainConfig.commandUsageChannelId}>`, inline: true },
        { name: 'Monitor Channel', value: `<#${mainConfig.monitorChannelId}>`, inline: true },
        { name: 'Unwhitelist Role', value: `<@&${mainConfig.unwhitelistRoleId}>`, inline: true },
        { name: 'Whitelist Role', value: `<@&${mainConfig.whitelistRoleId}>`, inline: true },
        { name: 'Welcome Channel', value: `<#${additionalConfig.welcomeChannelId}>`, inline: true },
        { name: 'Verify Channel', value: `<#${additionalConfig.verifyChannelId}>`, inline: true },
        { name: 'FAQ Channel', value: `<#${additionalConfig.faqChannelId}>`, inline: true },
        { name: 'welcomeimage', value: `${additionalConfig.welcomeImage}`, inline: true },
        { name: 'Verified Role', value: `<@&${additionalConfig.verifiedRoleId}>`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [checkEmbed] });
  },
};