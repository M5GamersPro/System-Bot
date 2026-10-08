const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../activity_database.json');

// Initialize database safely
let activityDb = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : { users: {} };

function saveActivity() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(activityDb, null, 2));
}

function ensureUser(userId) {
    if (!activityDb.users[userId]) {
        activityDb.users[userId] = { words: 0, voiceMinutes: 0 };
    }
}

module.exports = (client) => {
    // Background Voice Activity Loop (Fires every 60 seconds)
    setInterval(() => {
        client.guilds.cache.forEach(guild => {
            guild.voiceStates.cache.forEach(vs => {
                // RESTRICTIONS REMOVED: Tracks runtime time even if alone, muted, or deafened
                if (!vs.member || vs.member.user.bot || !vs.channelId) return;

                ensureUser(vs.member.id);
                activityDb.users[vs.member.id].voiceMinutes += 1;
            });
        });
        saveActivity();
    }, 60000);

    // Text Listener to Count Words
    client.on('messageCreate', (message) => {
        if (message.author.bot || !message.guild || message.content.startsWith('+')) return;

        const wordsArray = message.content.trim().split(/\s+/);
        if (wordsArray.length === 0 || wordsArray[0] === '') return;

        ensureUser(message.author.id);
        activityDb.users[message.author.id].words += wordsArray.length;
        saveActivity();
    });
};

module.exports.activityDb = activityDb;
module.exports.getUserActivity = (userId) => {
    ensureUser(userId);
    return activityDb.users[userId];
};
