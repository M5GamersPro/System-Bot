const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { db: levelDb, saveDatabase: saveLevelDb } = require('../../modules/database');
const { activityDb } = require('../../modules/activityTracker');
const fs = require('fs');
const path = require('path');

const ACTIVITY_FILE = path.join(__dirname, '../../activity_database.json');

module.exports = {
    name: 'reset', // This binds the trigger directly to +reset
    async execute(message, args, prefix) {
        // SECURITY GATEKEEPER: Only actual server Administrators can invoke this master reset
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ **Security Violation:** This command requires full Administrator privileges.');
        }

        // DOUBLE-CHECK SAFETY: Ask the admin to confirm to prevent accidental clicks
        // To complete the reset, they must type: +reset confirm
        const confirmationArg = args[0]?.toLowerCase();
        if (confirmationArg !== 'confirm') {
            return message.reply(`⚠️ **CRITICAL WARNING:** This will instantly wipe ALL server XP, text levels, voice minutes, and leaderboard standings back to zero.\n\nTo proceed, please type exactly:\n\`${prefix}reset confirm\``);
        }

        try {
            const statusNotice = await message.channel.send('⏳ *Initiating manual system wipe protocol...*');

            // SYSTEM 1: Wipe Active Levels, Tiers, and User XP Progress
            for (const userId in levelDb.users) {
                levelDb.users[userId].xp = 0;
                levelDb.users[userId].level = 1;
            }
            saveLevelDb();

            // SYSTEM 2: Wipe Word Counts & Voice Tracker Minutes data metrics
            for (const userId in activityDb.users) {
                activityDb.users[userId].words = 0;
                activityDb.users[userId].voiceMinutes = 0;
            }
            fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(activityDb, null, 2));

            console.log(`[MANUAL RESET] Server metrics completely wiped out by Admin: ${message.author.tag}`);

            // Generate beautifully styled completion layout box
            const completeEmbed = new EmbedBuilder()
                .setColor('#FF3333')
                .setTitle('🚨 Manual System Reset Complete')
                .setDescription(`The server tracking engine tables have been cleared by ${message.author}.`)
                .addFields(
                    { name: '📊 Progression Levels', value: 'Wiped to Level 1 (0 XP)', inline: true },
                    { name: '🎙️ Live Leaderboards', value: 'Wiped to 0 Words / Minutes', inline: true }
                )
                .setFooter({ text: 'The daily competitive race restarts immediately.' })
                .setTimestamp();

            await statusNotice.delete().catch(() => null);
            return message.channel.send({ embeds: [completeEmbed] });

        } catch (error) {
            console.error('[RESET COMMAND ERROR] Protocol execution failure:', error);
            return message.reply('❌ System Error: A problem occurred inside the files while attempting to clear storage data.');
        }
    }
};
