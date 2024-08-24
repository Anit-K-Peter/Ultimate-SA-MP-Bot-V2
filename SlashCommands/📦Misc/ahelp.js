const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ahelp')
    .setDescription('Display all commands and admin help information'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    await interaction.deferReply();

    const embed = new MessageEmbed()
      .setTitle('<a:commands:1269312832541950088> HERE ARE ALL THE COMMANDS <a:commands:1269312832541950088>')
      .setDescription('Select a category from the dropdown menu to view commands.')
      .setColor('#0000ff');

    const commandCategories = [
      { label: 'Default', description: 'View default commands', value: 'default', emoji: "<a:commands:1244899892694876222>" },
      { label: 'SAMP', description: 'View SAMP commands', value: 'samp', emoji:"<:SAMP:1244902400456921150>" },
      { label: 'Miscellaneous', description: 'View miscellaneous commands', value: 'misc', emoji:"<:otherside:1244902978859831346>" },
      { label: 'Announcement', description: 'View Announcement commands', value: 'ann', emoji:"<:AnnouncementChannel:1268562099932631212>" },
      { label: 'Admin', description: 'View admin commands', value: 'admin', emoji:"<:emoji_5:1252452547051126875>" },
      { label: 'Guild Management', description: 'View guild management commands', value: 'guild', emoji:"<:9048thumbsup:1152610400551059496>" }
    ];
    
    const commands = {
      default: [
        '?help',
        '?ping',
        '?botinfo',
        '?information',
        '?support',
        '?showcase',
        '?serverinfo'
      ],
      samp: [
        '?setchannel',
        '?samp',
        '?servers',
        '?players',
        '?player',
        '?register',
        '?removeacc',
        '?editmyacc',
        '?myacc'
      ],
      misc: [
        '?botsuggestion',
        '?bugreport',
        '?dm',
        '?say'
      ],
      ann: [
        '?underwork',
        '?online',
        '?restarting',
        '?hacked',
        '?deadchat',
        '?active',
        '?ddos',
        '?hostdown',
        '?noplayers',
        '?offline',
        '?backup',
        '?warning'
      ],
      admin: [
        '?kick {user}',
        '?lockchannel',
        '?unlockchannel',
        '?timeout time (60s/5m/10m/60m/24h/168h) {user}',
        '?untime {user}',
        '?ban {user} {reason}',
        '?unban {user}'
      ],
      guild: [
        '?serverinfo',
        '?update',
        '?createchannel',
        '?setchannel',
        '?setguildv3',
        '?setguildv4',
        '?setguildv2'
      ]
    };

    const selectMenu = new MessageSelectMenu()
      .setCustomId('command_category')
      .setPlaceholder('Select a command category')
      .addOptions(commandCategories.map(category => ({
        label: category.label,
        description: category.description,
        value: category.value,
        emoji: category.emoji
      })));

    const row = new MessageActionRow().addComponents(selectMenu);

    await interaction.editReply({ embeds: [embed], components: [row] });

    const filter = (interaction) => interaction.isSelectMenu() && interaction.customId === 'command_category';
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 60000 });

    collector.on('collect', async (interaction) => {
      if (!interaction.isSelectMenu()) return;

      await interaction.deferReply({ ephemeral: true });

      const selectedCategory = interaction.values[0];
      const selectedCommands = commands[selectedCategory];

      const commandEmbed = new MessageEmbed()
        .setTitle(`:clipboard: ${selectedCategory.toUpperCase()} COMMANDS :clipboard:`)
        .setDescription(`\`\`\`\n${selectedCommands.join('\n')}\n\`\`\``)
        .setColor('#0000ff');

      await interaction.editReply({ embeds: [commandEmbed] });
    });

    collector.on('end', collected => {
    });
  },
};