const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, '../system_database.json');
let db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : { users: {} };
module.exports = {
    db,
    saveDatabase: () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)),
    getUserProfile: (userId) => {
        if (!db.users[userId]) db.users[userId] = { xp: 0, level: 1, warnings: 0 };
        return db.users[userId];
    }
};
