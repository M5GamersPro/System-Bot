const { EmbedBuilder } = require('discord.js');
const { getUserActivity } = require('../../modules/activityTracker');

module.exports = {
    name: 'voice',
    execute(message) {
        const target = message.mentions.users.first() || message.author;
        const stats = getUserActivity(target.id);

        const hours = Math.floor(stats.voiceMinutes / 60);
        const mins = stats.voiceMinutes % 60;
        const formattedTime = hours > 0 ? `${hours} hours and ${mins} minutes` : `${mins} minutes`;

        const embed = new EmbedBuilder()
            .setColor('#2ECC71')
            .setTitle(`🎙️ Daily Voice Activity Statistics`)
            .setDescription(`**${target.username}** has spent a total of **${formattedTime}** (\`${stats.voiceMinutes} minutes\`) in voice channels today.`)
            .setFooter({ text: 'Daily stats reset completely at 12:00 AM Midnight.' });
        
        message.channel.send({ embeds: [embed] });
    }
};
