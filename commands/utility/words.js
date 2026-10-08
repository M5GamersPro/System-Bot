const { EmbedBuilder } = require('discord.js');
const { getUserActivity } = require('../../modules/activityTracker');

module.exports = {
    name: 'words',
    execute(message) {
        const target = message.mentions.users.first() || message.author;
        const stats = getUserActivity(target.id);

        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle(`💬 Daily Word Count Statistics`)
            .setDescription(`**${target.username}** has sent a total of **${stats.words.toLocaleString()}** words today.`)
            .setFooter({ text: 'Daily stats reset completely at 12:00 AM Midnight.' });
        
        message.channel.send({ embeds: [embed] });
    }
};
