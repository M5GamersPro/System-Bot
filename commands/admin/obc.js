const { EmbedBuilder } = require('discord.js');
const { isWhitelisted } = require('../../modules/whitelist');
module.exports = {
    name: 'obc',
    async execute(message, args) {
        if (!message.member.permissions.has('Administrator') && !isWhitelisted(message.author.id)) { return message.reply('❌ Unauthorized.'); }
        const rawBroadcastMessage = args.join(' ');
        if (!rawBroadcastMessage) return message.reply('❌ Missing text.');
        await message.guild.members.fetch();
        const humans = message.guild.members.cache.filter(member => !member.user.bot);
        const statusUpdateMessage = await message.channel.send({ embeds: [new EmbedBuilder().setColor('#7289DA').setDescription(`📡 Targeting: **${humans.size} members**.`)] });
        let pass = 0, fail = 0;
        for (const [id, member] of humans) {
            try {
                let msg = rawBroadcastMessage.replace(/{mention}/g, `<@${member.id}>`).replace(/{username}/g, member.user.username).replace(/{server}/g, message.guild.name);
                await member.send(`${msg}`); pass++;
            } catch { fail++; }
            await new Promise(r => setTimeout(r, 1500));
        }
        await statusUpdateMessage.edit({ embeds: [new EmbedBuilder().setColor('#00FF00').setTitle('✅ Finished').addFields({ name: 'Sent', value: `${pass}`, inline: true }, { name: 'Failed', value: `${fail}`, inline: true })] });
    }
};
