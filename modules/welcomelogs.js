const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberAdd', (member) => {
        const logChannel = member.guild.channels.cache.find(ch => ch.name === 'welcome' || ch.name === 'logs');
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('📥 User Joined')
            .setDescription(`Welcome ${member}!`)
            .addFields({ name: 'Total Members', value: `${member.guild.memberCount}`, inline: true })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    });
};
