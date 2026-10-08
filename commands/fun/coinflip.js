module.exports = {
    name: 'coinflip',
    execute(message) { message.reply(`🪙 **${Math.random() < 0.5 ? 'Heads' : 'Tails'}**!`); }
};
