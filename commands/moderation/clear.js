module.exports = {
    name: 'clear',
    async execute(message, args) {
        if (!message.member.permissions.has('ManageMessages')) return;
        const total = parseInt(args[0]);
        if (isNaN(total) || total < 1 || total > 100) return message.reply('❌ 1-100 only.');
        await message.channel.bulkDelete(total, true);
        const conf = await message.channel.send(`🧹 Purged **${total}** messages.`);
        setTimeout(() => conf.delete().catch(() => null), 3000);
    }
};
