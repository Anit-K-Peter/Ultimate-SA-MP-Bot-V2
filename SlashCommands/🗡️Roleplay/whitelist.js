
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
   .setName('whitelist')
   .setDescription('Whitelist a user')
   .addUserOption(option =>
      option.setName('user')
       .setDescription('The user to whitelist')
       .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      await interaction.reply(`User not found in the guild!`);
      return;
    }

    const roleToRemoveId = '1252230100771016785';
    const roleToAddId = '1252230173206646835';

    const roleToRemove = interaction.guild.roles.cache.get(roleToRemoveId);
    const roleToAdd = interaction.guild.roles.cache.get(roleToAddId);

    if (!roleToRemove ||!roleToAdd) {
      await interaction.reply(`One or both roles not found!`);
      return;
    }

    if (member.roles.cache.has(roleToAddId)) {
      await interaction.reply(`User already has the ${roleToAdd.name} role!`);
      return;
    }

    await member.roles.remove(roleToRemove);
    await member.roles.add(roleToAdd);

    const logChannel = interaction.guild.channels.cache.get('1252633068649316455');
    if (logChannel) {
      logChannel.send(`**Whitelisted User**: ${user.username} (${user.id})\n**Removed Role**: ${roleToRemove.name} (${roleToRemoveId})\n**Added Role**: ${roleToAdd.name} (${roleToAddId})`);
    }

    await interaction.reply(`Added ${roleToAdd.name} and removed ${roleToRemove.name} from ${user.username}!`);
  },
};
