const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help', // Binds the trigger cleanly to +help
    execute(message, args, prefix) {
        const embed = new EmbedBuilder()
            .setColor('#7289DA')
            .setTitle('⚙️ System Architecture Index')
            .setDescription(`Current operational bot prefix: \`${prefix}\``)
            .addFields(
                { 
                    name: '👑 Administrative Systems', 
                    value: `\`${prefix}obc [message]\` - Global placeholder-supported broadcast\n\`${prefix}whitelist add/remove/list\` - Manage authorized bot personnel` 
                },
                { 
                    name: '📈 Daily Leaderboard Trackers (Resets 12:00 AM)', 
                    value: `\`${prefix}words [@user]\` - Check today's text word count statistics\n\`${prefix}voice [@user]\` - Check today's total voice minutes\n\`${prefix}topwords\` - View today's top 10 text chatters leaderboard\n\`${prefix}topvoice\` - View today's top 10 active voice leaderboard` 
                },
                { 
                    name: '🛡️ Moderation Enforcers', 
                    value: `\`${prefix}kick @user [reason]\` - Evict user\n\`${prefix}ban @user [reason]\` - Blacklist user\n\`${prefix}mute @user [minutes]\` - Timeout user\n\`${prefix}unmute @user\` - Remove timeout\n\`${prefix}warn @user [reason]\` - Log formal infraction\n\`${prefix}clear [1-100]\` - Purge channel buffer` 
                },
                { 
                    name: '🎯 Utility & Fun Matrix', 
                    value: `\`${prefix}profile [@user]\` - View daily level card\n\`${prefix}serverinfo\` - Display server metrics\n\`${prefix}ping\` - Check response delay\n\`${prefix}avatar [@user]\` - Grab user profile picture\n\`${prefix}coinflip\` - Play a mini game` 
                }
            )
            .setFooter({ text: 'All progression levels and tracker leaderboards zero out entirely at 12:00 AM Midnight.' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
