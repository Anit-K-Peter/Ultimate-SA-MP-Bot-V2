const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('911')
    .setDescription('Emergency Call Or Support ticket system to call police or admins')
    .addStringOption(option => 
      option.setName('type')
        .setDescription('Emergency Call Or Support ticket system to call police or admins')
        .setRequired(true)
        .addChoices(
          { name: 'Fail Roleplaying (FRP)', value: 'FRP' },
          { name: 'Support', value: 'SUPPORT' },
          { name: 'Account Support', value: 'Account_Support'},
          { name: 'File a Case', value: 'FILE_CASE' },
        ))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Enter the reason for opening this ticket')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true }); // Acknowledge the interaction immediately

    const type = interaction.options.getString('type');
    const reason = interaction.options.getString('reason');
    const categoryId = '1252252530671620169'; // Replace with your desired category ID
    const roleId = '1252182459395735613'; // Replace with your desired role ID

    // Determine channel name prefix based on type
    let channelNamePrefix = '';
    switch (type) {
      case 'FRP':
        channelNamePrefix = 'FRP-TICKET';
        break;
      case 'SUPPORT':
        channelNamePrefix = 'SUPPORT-TICKET';
        break;
      case 'Account_Support':
        channelNamePrefix = 'Acc-Service';
        break;
      case 'FILE_CASE':
        channelNamePrefix = 'CASE-TICKET';
        break;
      default:
        await interaction.editReply('Invalid ticket type selected.');
        return;
    }

    // Find the category and create a channel
    const category = interaction.guild.channels.cache.get(categoryId);
    if (!category || category.type !== 'GUILD_CATEGORY') {
      await interaction.editReply('Category not found or invalid.');
      return;
    }

    // Find the role
    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) {
      await interaction.editReply('Role not found or invalid. Please make sure the bot has the necessary permissions to view and manage roles.');
      return;
    }

    // Generate a unique channel name
    let channelName = `${channelNamePrefix}-${generateChannelNumber(interaction.guild.channels.cache)}`;
    while (interaction.guild.channels.cache.some(channel => channel.name === channelName)) {
      channelName = `${channelNamePrefix}-${generateChannelNumber(interaction.guild.channels.cache)}`;
    }

    try {
      // Create the channel with permissions
      const createdChannel = await interaction.guild.channels.create(channelName, {
        type: 'GUILD_TEXT',
        parent: category,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL']
          },
          {
            id: role.id,
            allow: ['VIEW_CHANNEL', 'MANAGE_MESSAGES']
          }
        ]
      });

      // Create an embed
      const embed = new MessageEmbed()
        .setTitle(`Ticket Created: ${type}`)
        .setDescription(`This ticket was created on the topic of **${type}** with \n### The reason is: **${reason}.**`)
        .setColor('GREEN');

      // Create buttons
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('close-ticket')
            .setLabel('Close Ticket')
            .setStyle('DANGER'),
          new MessageButton()
            .setCustomId('reopen-ticket')
            .setLabel('Reopen Ticket')
            .setStyle('SUCCESS')
        );

      // Send the message with the embed and buttons
      const message = await createdChannel.send({ embeds: [embed], components: [row] });

      // Add event listeners for button interactions
      const filter = i => i.customId === 'close-ticket' || i.customId === 'reopen-ticket';
      const collector = message.createMessageComponentCollector({ filter, time: 30000 });

      collector.on('collect', async i => {
        if (i.customId === 'close-ticket') {
          await i.deferUpdate();
          await message.delete();
          await createdChannel.delete();
          await i.followUp('Ticket closed and deleted!');
        } else if (i.customId === 'reopen-ticket') {
          await i.deferUpdate();
          await message.edit({ components: [] });
          await i.followUp('Ticket reopened!');
        }
      });

      await interaction.editReply(`Ticket channel created: ${createdChannel}`);
    } catch (error) {
      console.error('Error creating ticket channel:', error);
      await interaction.editReply('There was an error while processing your request.');
    }
  },
};

// Function to generate a unique channel number
function generateChannelNumber(channels) {
  let number = 1;
  while (channels.some(channel => channel.name.endsWith(`-${number}`))) {
    number++;
  }
  return number.toString().padStart(3, '0');
}
