const { getUserProfile, saveDatabase } = require('../../modules/database');
module.exports = {
    name: 'warn',
    execute(message, args) {
        if (!message.member.permissions.has('KickMembers')) return;
        const target = message.mentions.users.first();
        if (!target) return message.reply('❌ Specify user.');
        const profile = getUserProfile(target.id);
        profile.warnings += 1; saveDatabase();
        message.channel.send(`⚠️ **${target.username}** warned. Total: **${profile.warnings}**.`);
    }
};
