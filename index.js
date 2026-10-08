const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Initialize central system client with required connection intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates // Required for automated temporary voice channels & tracking activity
    ]
});

client.commands = new Collection();

// Recursive Command Loader (reads every nested sub-folder inside /commands)
const loadCommands = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            client.commands.set(command.name, command);
        }
    }
};
loadCommands(path.join(__dirname, 'commands'));

// Connect Active Background Modules on Successful Connection Boot
client.once('ready', () => {
    console.log(`[CORE] ${client.user.tag} boot framework successfully loaded.`);
    client.user.setActivity('+help', { type: 3 }); // Configures watching status activity matching global prefix
    
    // Fire up background tracking architectures (welcomeLogs removed to fix Wispbyte pathing issues)
    require('./modules/voiceTracker')(client);
    require('./modules/midnightReset')(client);
    require('./modules/tempVoice')(client);
    require('./modules/activityTracker')(client);
});

// Event Handler: Router for Security Rules, Chat Actions, and Command Execution
const { isWhitelisted } = require('./modules/whitelist');
const { getUserProfile, saveDatabase } = require('./modules/database');
const handleAutoMod = require('./modules/automod');

client.on('messageCreate', async (message) => {
    // Basic filter safety check: Ignore bots or non-server environments
    if (message.author.bot || !message.guild) return;

    // Run custom text formatting / security firewall script scans
    const wasInfraction = await handleAutoMod(message);
    if (wasInfraction) return; 

    // UNIFIED SYSTEM PREFIX: Exclusively monitor for your '+' sign
    const PREFIX = '-';

    // Global Progression Matrix for normal text chatters who aren't running commands
    if (!message.content.startsWith(PREFIX)) {
        const profile = getUserProfile(message.author.id);
        profile.xp += Math.floor(Math.random() * 5) + 5; // Adds random daily XP metrics
        if (profile.xp >= profile.level * 100) {
            profile.xp -= profile.level * 100;
            profile.level += 1;
            message.channel.send(`🎉 **${message.author.username}** leveled up to **Level ${profile.level}**!`);
        }
        saveDatabase();
        return;
    }

    // Split raw command args properly while ignoring accidental double spacing
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // --- WHITELIST SYSTEM GATEKEEPER ---
    // Actual server Administrators are always bypassed. Custom users must be whitelisted.
    if (!message.member.permissions.has('Administrator') && !isWhitelisted(message.author.id)) {
        return message.reply('❌ **System Restriction:** You must be whitelisted to interact with this bot matrix.');
    }

    // Attempt modular file command compilation execution
    const command = client.commands.get(commandName);
    if (command) {
        command.execute(message, args, PREFIX);
    }
});

// Replace this placeholder string with your real secret token from the Discord Developer Portal
client.login('YOUR-BOT-TOKEN-HERE');
1OA.GgbwIg.rgIjKQNa8jTPMRGym6-OWyEZ68WwplyTUM567A');
