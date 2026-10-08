const { EmbedBuilder } = require('discord.js');
const { getUserProfile } = require('../../modules/database');
module.exports = {
    name: 'profile',
    execute(message) {
        const user = message.mentions.users.first() || message.author;
        const stats = getUserProfile(user.id);
        const embed = new EmbedBuilder().setColor('#EB459E').setTitle(`👤 ${user.username}`).setThumbnail(user.displayAvatarURL())
            .addFields({ name: '🌟 Level', value: `${stats.level}`, inline: true }, { name: '📈 XP', value: `${stats.xp}/${stats.level * 100}`, inline: true }, { name: '⚠️ Warns', value: `${stats.warnings}`, inline: false })
            .setFooter({ text: 'Resets at 12:00 AM daily.' });
        message.channel.send({ embeds: [embed] });
    }
};
