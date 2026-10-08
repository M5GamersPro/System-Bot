const { EmbedBuilder } = require('discord.js');
const { activityDb } = require('../../modules/activityTracker');

module.exports = {
    name: 'topvoice',
    async execute(message) {
        const sorted = Object.entries(activityDb.users)
            .map(([id, data]) => ({ id, mins: data.voiceMinutes }))
            .filter(u => u.mins > 0)
            .sort((a, b) => b.mins - a.mins)
            .slice(0, 10);

        if (sorted.length === 0) {
            return message.reply('📊 No active voice metrics recorded for today yet.');
        }

        let description = '';
        for (let i = 0; i < sorted.length; i++) {
            try {
                const userObj = await message.client.users.fetch(sorted[i].id);
                const hrs = Math.floor(sorted[i].mins / 60);
                const remainingMins = sorted[i].mins % 60;
                const timeString = hrs > 0 ? `${hrs}h ${remainingMins}m` : `${remainingMins}m`;

                description += `**#${i + 1}** \`${userObj.username}\` — **${timeString}** (\`${sorted[i].mins}m\`)\n`;
            } catch {
                description += `**#${i + 1}** User ID: \`${sorted[i].id}\` — \`${sorted[i].mins}m\`\n`;
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle(`👑 Daily Voice Leaderboard (Top Voice)`)
            .setDescription(description)
            .setFooter({ text: 'This leaderboard resets completely at 12:00 AM Midnight.' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
