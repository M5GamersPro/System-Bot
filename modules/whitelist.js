const fs = require('fs');
const path = require('path');
const WL_FILE = path.join(__dirname, '../whitelist_database.json');
let whitelist = fs.existsSync(WL_FILE) ? JSON.parse(fs.readFileSync(WL_FILE)) : [];
module.exports = {
    whitelist,
    saveWhitelist: () => fs.writeFileSync(WL_FILE, JSON.stringify(whitelist, null, 2)),
    isWhitelisted: (userId) => whitelist.includes(userId),
    addWhitelist: (userId) => {
        if (!whitelist.includes(userId)) { whitelist.push(userId); return true; }
        return false;
    },
    removeWhitelist: (userId) => {
        const index = whitelist.indexOf(userId);
        if (index > -1) { whitelist.splice(index, 1); return true; }
        return false;
    }
};
