const { db: levelDb, saveDatabase: saveLevelDb } = require('./database');
const { activityDb } = require('./activityTracker');
const fs = require('fs');
const path = require('path');

const ACTIVITY_FILE = path.join(__dirname, '../activity_database.json');
const SNAPSHOT_FILE = path.join(__dirname, '../yesterday_snapshot.json');

// Initialize the gatekeeping variable tracking the last reset date string
let lastResetDate = ""; 

module.exports = (client) => {
    // Check the clock every 10 seconds (much faster) to ensure absolute precision
    setInterval(() => {
        // Calculate Egypt's accurate local time
        const egyptTimeString = new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" });
        const egyptDate = new Date(egyptTimeString);
        
        const currentHour = egyptDate.getHours();
        const currentDayString = egyptDate.toDateString(); // Example: "Tue Jul 07 2026"

        // Initialize state flag on bot boot to prevent immediate unwanted wipes
        if (!lastResetDate) {
            lastResetDate = currentDayString;
            return;
        }

        // TRIGGER RULE: It is 12:00 AM (Hour 0) AND the calendar day has officially flipped
        if (currentHour === 0 && lastResetDate !== currentDayString) {
            console.log(`[SYSTEM] Midnight reached in Egypt (${currentDayString}). Running absolute data reset matrix...`);
            
            // Lock the system immediately so it cannot run again until tomorrow
            lastResetDate = currentDayString;

            try {
                // 1. GENERATE YESTERDAY SNAPSHOT: Top 3 Words
                const topWords = Object.entries(activityDb.users)
                    .map(([id, data]) => ({ id, value: data.words }))
                    .filter(u => u.value > 0)
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3);

                // 2. GENERATE YESTERDAY SNAPSHOT: Top 3 Voice Minutes
                const topVoice = Object.entries(activityDb.users)
                    .map(([id, data]) => ({ id, value: data.voiceMinutes }))
                    .filter(u => u.value > 0)
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3);

                // Save snapshot structure to drive storage disk
                const snapshotData = { date: currentDayString, topWords, topVoice };
                fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshotData, null, 2));

                // 3. WIPE LEVELS SYSTEM: Clear daily XP data
                for (const userId in levelDb.users) {
                    levelDb.users[userId].xp = 0;
                    levelDb.users[userId].level = 1;
                }
                saveLevelDb();

                // 4. WIPE ACTIVITY SYSTEM: Clear daily message word length metrics
                for (const userId in activityDb.users) {
                    activityDb.users[userId].words = 0;
                    activityDb.users[userId].voiceMinutes = 0;
                }
                fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(activityDb, null, 2));

                console.log(`[SYSTEM] Success: All data tables have zeroed out for the new day.`);

                // Broadcast congratulations announcement notification to server text chat channels
                client.guilds.cache.forEach(guild => {
                    const activeChatChannel = guild.channels.cache.find(ch => ch.name === 'general' || ch.name === 'chat' || ch.isTextBased());
                    if (activeChatChannel) {
                        activeChatChannel.send(`⏰ **12:00 AM Midnight Reset!** Today's text and voice metrics have zeroed out. Use \`+yesterday\` to view the final champions of the last cycle!`);
                    }
                });

            } catch (error) {
                console.error(`[SYSTEM ERROR] Failsafe abort inside reset engine pipeline:`, error);
            }
        }
    }, 10000); // 10,000ms = Scans every 10 seconds so it can never miss the midnight window
};
