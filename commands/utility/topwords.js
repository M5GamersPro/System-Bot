const { EmbedBuilder } = require('discord.js');
const { activityDb } = require('../../modules/activityTracker');

module.exports = {
    name: 'topwords',
    async execute(message) {
        const sorted = Object.entries(activityDb.users)
            .map(([id, data]) => ({ id, words: data.words }))
            .filter(u => u.words > 0)
            .sort((a, b) => b.words - a.words)
            .slice(0, 10);

        if (sorted.length === 0) {
            return message.reply('📊 No text metrics recorded for today yet.');
        }

        let description = '';
        for (let i = 0; i < sorted.length; i++) {
            try {
                const userObj = await message.client.users.fetch(sorted[i].id);
                description += `**#${i + 1}** \`${userObj.username}\` — **${sorted[i].words.toLocaleString()}** words\n`;
            } catch {
                description += `**#${i + 1}** User ID: \`${sorted[i].id}\` — **${sorted[i].words.toLocaleString()}** words\n`;
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#E67E22')
            .setTitle(`👑 Daily Text Leaderboard (Top Words)`)
            .setDescription(description)
            .setFooter({ text: 'This leaderboard resets completely at 12:00 AM Midnight.' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
