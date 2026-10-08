module.exports = {
    name: 'mute',
    async execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) return;
        const member = message.mentions.members.first();
        if (!member) return message.reply('❌ Missing user.');
        const minutes = parseInt(args[1]) || 15;
        await member.timeout(minutes * 60 * 1000);
        message.channel.send(`🤫 **${member.user.tag}** muted for ${minutes}m.`);
    }
};
