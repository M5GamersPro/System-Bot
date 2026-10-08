const { getUserProfile, saveDatabase } = require('./database');

module.exports = (client) => {
    setInterval(() => {
        client.guilds.cache.forEach(guild => {
            guild.voiceStates.cache.forEach(vs => {
                // RESTRICTIONS REMOVED: Earns XP even if alone, muted, or deafened
                if (!vs.member || vs.member.user.bot || !vs.channelId) return;

                const profile = getUserProfile(vs.member.id);
                profile.xp += 15;
                if (profile.xp >= profile.level * 100) {
                    profile.xp -= profile.level * 100;
                    profile.level += 1;
                    const channel = guild.systemChannel || guild.channels.cache.find(ch => ch.isTextBased());
                    if (channel) channel.send(`🎙️ **${vs.member.user.username}** voice leveled up to **Level ${profile.level}**!`);
                }
            });
        });
        saveDatabase();
    }, 60000);
};
