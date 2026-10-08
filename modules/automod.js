const BANNED_WORDS = ['scamlink', 'free-nitro', 'discord.gg/fakeinvite'];
module.exports = async (message) => {
    const isViolator = BANNED_WORDS.some(word => message.content.toLowerCase().includes(word));
    if (isViolator) {
        await message.delete().catch(() => null);
        const warning = await message.channel.send(`⚠️ ${message.author}, blacklisted text patterns are blocked.`);
        setTimeout(() => warning.delete().catch(() => null), 4000);
        return true; 
    }
    return false;
};
