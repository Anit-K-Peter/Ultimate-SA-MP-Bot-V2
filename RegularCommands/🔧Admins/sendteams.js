const { Client, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');
const teamsData = require('../../data/teams.json');

module.exports = {
  name: 'endteam',
  description: 'Send team information to the channel',
  async execute(message) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    for (const team in teamsData) {
      const teamName = team;
      const alias = teamsData[team].alias;
      const colorName = teamsData[team].colorName;
      const color = teamsData[team].color;
      const boss = teamsData[team].boss;

      const teamEmbed = new MessageEmbed()
       .setTitle(`Team Information Of ${teamName} | ${alias}`)
       .setDescription(`The Best Team is ${teamName}\nColor : ${colorName}\n\nLeader : <@${boss}>`)
       .setColor(color);

      message.channel.send({ embeds: [teamEmbed] });
    }
  },
};