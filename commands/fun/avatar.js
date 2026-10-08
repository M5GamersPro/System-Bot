const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'avatar',
    execute(message) {
        const user = message.mentions.users.first() || message.author;
        const embed = new EmbedBuilder().setColor('#00FFFF').setTitle(`${user.username}`).setImage(user.displayAvatarURL({ size: 1024, dynamic: true }));
        message.channel.send({ embeds: [embed] });
    }
};
