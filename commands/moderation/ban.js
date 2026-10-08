module.exports = {
    name: 'ban',
    async execute(message, args) {
        if (!message.member.permissions.has('BanMembers')) return;
        const member = message.mentions.members.first();
        if (!member || !member.bannable) return message.reply('❌ Cannot ban user.');
        await member.ban({ reason: args.slice(1).join(' ') || 'None' });
        message.channel.send(`🚫 **${member.user.tag}** banned.`);
    }
};
