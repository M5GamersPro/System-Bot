module.exports = {
    name: 'kick',
    async execute(message, args) {
        if (!message.member.permissions.has('KickMembers')) return;
        const member = message.mentions.members.first();
        if (!member || !member.kickable) return message.reply('❌ Cannot kick user.');
        await member.kick(args.slice(1).join(' ') || 'None');
        message.channel.send(`🚨 **${member.user.tag}** kicked.`);
    }
};
