const { ChannelType } = require('discord.js');
const CREATOR_CHANNEL_NAME = '➕ Join to Create'; 
const tempChannels = new Set();
module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        const member = newState.member;
        if (!member || member.user.bot) return;
        if (newState.channel && newState.channel.name === CREATOR_CHANNEL_NAME) {
            try {
                const createdChannel = await newState.guild.channels.create({
                    name: `🔊 ${member.user.username}'s Room`,
                    type: ChannelType.GuildVoice,
                    parent: newState.channel.parentId,
                    userLimit: 5
                });
                tempChannels.add(createdChannel.id);
                await member.voice.setChannel(createdChannel);
            } catch (err) { console.error(err); }
        }
        if (oldState.channelId && tempChannels.has(oldState.channelId)) {
            const channelToCheck = oldState.guild.channels.cache.get(oldState.channelId);
            if (channelToCheck && channelToCheck.members.size === 0) {
                try { await channelToCheck.delete(); tempChannels.delete(oldState.channelId); } catch { tempChannels.delete(oldState.channelId); }
            }
        }
    });
};
