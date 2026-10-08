const { EmbedBuilder } = require('discord.js');
const { whitelist, addWhitelist, removeWhitelist, saveWhitelist } = require('../../modules/whitelist');
module.exports = {
    name: 'whitelist',
    execute(message, args, prefix) {
        if (!message.member.permissions.has('Administrator')) return;
        const subCommand = args[0]?.toLowerCase();
        const targetUser = message.mentions.users.first() || (args[1] ? { id: args[1], username: `ID: ${args[1]}` } : null);
        if (subCommand === 'list') {
            return message.channel.send({ embeds: [new EmbedBuilder().setColor('#7289DA').setTitle('📋 Whitelist').setDescription(whitelist.map(id => `• <@${id}>`).join('\n') || '*Empty*')] });
        }
        if (!targetUser) return message.reply('❌ Specify a user.');
        if (subCommand === 'add') {
            if (addWhitelist(targetUser.id)) { saveWhitelist(); return message.channel.send(`✅ Added ${targetUser.username}.`); }
        } else if (subCommand === 'remove') {
            if (removeWhitelist(targetUser.id)) { saveWhitelist(); return message.channel.send(`❌ Removed ${targetUser.username}.`); }
        }
    }
};
