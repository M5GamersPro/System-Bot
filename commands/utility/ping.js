module.exports = {
    name: 'ping',
    execute(message) { message.reply(`🏓 Latency: **${message.client.ws.ping}ms**.`); }
};
