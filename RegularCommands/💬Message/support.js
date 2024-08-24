const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'support',
    description: 'Get the link to join the support server.',
    execute(message) {
        // Create an embed with the support server information
        const supportEmbed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Need help? Join Support Server:")
            .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
            .addFields({
                name: "Click Blue Text Below:",
                value: `[Contact DEV for support](https://discord.gg/WRRORER)`
            });

        // Send the embed to the channel where the command was invoked
        message.channel.send({ embeds: [supportEmbed] });
    },
};
