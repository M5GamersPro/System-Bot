const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'serverinfo',
    execute(message) {
        const embed = new EmbedBuilder().setColor('#FFA500').setTitle(`📊 ${message.guild.name}`).addFields({ name: 'Members', value: `${message.guild.memberCount}`, inline: true }, { name: 'Channels', value: `${message.guild.channels.cache.size}`, inline: true });
        message.channel.send({ embeds: [embed] });
    }
};
