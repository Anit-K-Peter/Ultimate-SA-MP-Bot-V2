const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const teamsData = require('../../data/teams.json');

module.exports = {
  data: new SlashCommandBuilder()
   .setName('maketeam')
   .setDescription('Create a team with a custom role and channel')
   .addStringOption(option => 
      option.setName('team_name')
       .setDescription('The name of the team')
       .setRequired(true)
    )
   .addUserOption(option => 
      option.setName('boss')
       .setDescription('The boss of the team')
       .setRequired(true)
    )
   .addStringOption(option => 
      option.setName('color')
       .setDescription('The color of the team role (hex code)')
       .setRequired(true)
    )
   .addStringOption(option => 
      option.setName('skin')
       .setDescription('The skin of the team')
       .setRequired(true)
    )
   .addStringOption(option => 
      option.setName('color_name')
       .setDescription('The color name of the team role')
       .setRequired(true)
    )
   .addStringOption(option => 
      option.setName('alias')
       .setDescription('The alias of the team')
       .setRequired(true)
    ),
    async execute(interaction) {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      }

    const teamName = interaction.options.getString('team_name');
    const boss = interaction.options.getMember('boss');
    const color = interaction.options.getString('color');
    const skin = interaction.options.getString('skin');
    const colorName = interaction.options.getString('color_name');
    const alias = interaction.options.getString('alias');

    // Create role
    const role = await interaction.guild.roles.create({
      name: teamName,
      color: color,
    });

    // Create channel
    const category = interaction.guild.channels.cache.get('1252195616159825990');
    const channel = await category.createChannel(`🚬team-${teamName}`, {
      type: 'GUILD_TEXT',
      permissionOverwrites: [
        {
          id: role.id,
          allow: ['VIEW_CHANNEL'],
        },
        {
          id: interaction.guild.roles.cache.find(role => role.name === '@everyone').id,
          deny: ['VIEW_CHANNEL'],
        },
      ],
    });

    // Give role to boss
    boss.roles.add(role);

    // Send embed to channels
    const embed = new MessageEmbed()
      .setTitle(`Team Information Of ${teamName} | ${alias}`)
      .setDescription(`Role : ${role}\nColor : ${colorName}\n\nLeader : ${boss}`)
      .setColor(color);

    channel.send({ embeds: [embed], content: `@here ${boss}` });
    interaction.guild.channels.cache.get('1259837127341113436').send({ embeds: [embed] });
    interaction.guild.channels.cache.get('1264487698765189213').send({ embeds: [embed] });

    await interaction.deferReply();

    // Write team details to teams.json
    teamsData[teamName] = {
      alias: alias,
      boss: boss.id,
      color: color,
      skin: skin,
      colorName: colorName,
      channelId: channel.id,
      roleId: role.id,
    };
    fs.writeFileSync('./data/teams.json', JSON.stringify(teamsData, null, 2));

    await interaction.followUp(`Team ${teamName} created!`);
  },
};