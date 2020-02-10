const Discord = require("discord.js");
const bot = new Discord.Client();
bot.on("ready", () => {
    bot.user.setPresence({
        game: {
            name: 'sh*help, status: 1'
        },
        status: 'online'
    });
    console.log(`Serving ${bot.guilds.size} servers`); // I'm gonna remove this someday
    var guilds = bot.guilds.array();
    for (let i = 0; i < guilds.length; i++) {
        console.log(guilds[i].name);
    }
});
bot.on("guildCreate", async gc => {
    gc.channels.find(r => r.name === "general").send("Hello! I can set up your server for you. Just use sh*help to get started!");
    console.log(gc.name);
});
bot.on("guildMemberAdd", async mem => {
    if (mem.guild !== "110373943822540800") {
        mem.guild.channels.find(c => c.name === "general").send("Hello, " + mem.user.username + ", welcome to " + mem.guild.name + "! Please familiarise yourself with the <#" + mem.guild.channels.find(c => c.name === "rules").id + ">, and read <#" + mem.guild.channels.find(c => c.name === "welcome").id + ">!");
    }
});
bot.on("messageDelete", async md => {
    if (md.guild.channels.find(c => c.name === "delete-logs")) {
        const del = new Discord.RichEmbed()
            .setColor('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
            .setTitle("Message Deleted")
            .setDescription("Author: " + md.author.id + "/" + md.author.username + "#" + md.author.discriminator + "\nChannel: " + md.channel.id + "/" + md.channel.name + "\nContent: " + md.content);
        md.guild.channels.find(c => c.name === "delete-logs").send(del);
    }
});
bot.on("message", async msg => {
    var send = "";
    if (msg.author.bot) return; // any message from a bot is ignored

    if (msg.content.indexOf("sh*") !== 0) return; // checks to make sure the prefix (derived from config.json) is present in the message

    const args = msg.content.slice(3).trim().split(/ +/g); // trims the args

    const cmd = args.shift().toLowerCase(); // finds the actual command

    const guild = msg.guild; // shortens the code a LOOOT.

    const cha = msg.channel; // same as above!

    if (cmd === "setup") {

        if (guild.afkChannel) {

            send += ("There is already an AFK channel set.");

        } else {

            if (guild.channels.find(ct => ct.name === "Voice Channels" && ct.type === "category")) {

                guild.createChannel("AFK", {

                    type: "voice"

                }).then(function(nc) {

                    nc.setParent(guild.channels.find(ct => ct.name === "Voice Channels"));

                    guild.setAFKChannel(nc);

                });

                send += ("Successfully created an AFK Channel!");

            } else {

                guild.createChannel("Voice Channels", {

                    type: "category"

                });

                guild.createChannel("AFK", {

                    type: "voice"

                }).then(function(nc) {

                    nc.setParent(guild.channels.find(ct => ct.name === "Voice Channels"));

                    guild.setAFKChannel(nc);

                });

                send += ("Successfully created a voice category and an AFK Channel!");

            }

        }
        let guildRoles = guild.roles.array();
        let checkAdmin = function() {
            for (let i = 0; i < guildRoles.length; i++) {
                if (guildRoles[i].hasPermission('ADMINISTRATOR') && guildRoles[i].name !== "Server Helper") {
                    return true;
                } else {
                    var none;
                }
            }
        };
        if (checkAdmin()) {
            send += ("\nThere is already an admin role.");
        } else {
            guild.createRole({
                name: "Admin",
                permissions: ["ADMINISTRATOR"]
            });
            send += ("\nSuccessfully created an admin role!");
        }
        if (guild.defaultMessageNotifications === 'MENTIONS') {
            send += ("\nDefault notification settings are already on mentions only.");
        } else {
            msg.guild.setDefaultMessageNotifications('MENTIONS');
            send += ("\nSet default notifications to mentions only.");

        }

        if (guild.channels.find(ch => ch.name === "welcome")) {
            send += ("\nThere is already a welcome channel.");
        } else {
            guild.createChannel('welcome', {
                type: 'text',
                permissionOverwrites: [{
                    id: msg.guild.id,
                    deny: ['SEND_MESSAGES'],
                }],
            }).then(function(ch) {

                ch.createInvite({
                    maxAge: 0,
                    maxUses: 0
                }).then(function(inv) {

                    ch.send("Permanent invite link: " + inv.url);

                });

            });

            send += ("\nSet up a welcome channel and a permanent invite link.");
        }
        if (guild.defaultRole.hasPermission('MENTION_EVERYONE')) {
            guild.defaultRole.setPermissions(104193089);
            send += "\nThe `@everyone` role is no longer mentionable by everyone.";
        } else {
            send += "\nThe `@everyone` role is not mentionable.";
        }
        if (bot.channels.find("name", "rules")) {
            send += "\nThere already seems to be a rules channel.";
        } else {
            guild.createChannel('rules', {
                type: 'text',
                permissionOverwrites: [{
                    id: msg.guild.id,
                    deny: ['SEND_MESSAGES'],
                }],
            }).then(function(ch) {
                ch.send("Set up your rules here! A few rules to get you started:\n1. No spamming\n2. No toxicity or bigotry\n3. Don't ping entire roles, only ping mods/admins if you need them\n4. No walls of text\nGet started on your rules!");
            });
            send += "\nSet up a rules channel.";
        }
        if (guild.channels.find(c => c.name === "delete-logs")) {
            send += "\nDelete logs already seem to exist.";
        } else {
            guild.createChannel('delete-logs', {
                type: 'text',
                permissionOverwrites: [{
                    id: msg.guild.id,
                    deny: ['SEND_MESSAGES'],
                }],
            });
            send += "\nCreated a delete logs channel.";
        }
        cha.send(send);
    }
    if (cmd === "stop" && msg.author.id === "577041100016189441") { // this is my id. only i can stop the bot
        process.exit();
    }
    if (cmd === "name") {
        guild.setName(args.join(" "));
        cha.send("Successfully set the guild's name to " + args.join(" ") + "!");
    }
    if (cmd === "check") {
        if (guild.afkChannel) {

            send += ("There is already an AFK channel set.");

        } else {

            if (guild.channels.find(ct => ct.name === "Voice Channels" && ct.type === "category")) {
                send += ("No AFK channel exists.");

            } else {
                send += ("No VC category or AFK channel exists.");

            }

        }
        let guildRoles = guild.roles.array();
        let checkAdmin = function() {
            for (let i = 0; i < guildRoles.length; i++) {
                if (guildRoles[i].hasPermission('ADMINISTRATOR') && guildRoles[i].name !== "Server Helper") {
                    return true;
                } else {
                    var non;
                }
            }
        };
        if (checkAdmin()) {
            send += ("\nThere is already an admin role.");
        } else {
            send += ("\nNo admin role exists.");
        }
        if (guild.defaultMessageNotifications === 'MENTIONS') {
            send += ("\nDefault notification settings are already on mentions only.");
        } else {
            send += ("\nDefault notification settings are on all messages--CHANGE THIS IMMEDIATELY!");
        }
        if (guild.channels.find(ch => ch.name === "welcome")) {
            send += ("\nThere is already a welcome channel.");
        } else {
            send += ("\nNo welcome channel seems to exist.");
        }
        if (guild.defaultRole.hasPermission('MENTION_EVERYONE')) {
            send += "\nThe `@everyone` role is mentionable by everyone--CHANGE THIS IMMEDIATELY!";
        } else {
            send += "\nThe `@everyone` role is not mentionable.";
        }
        if (guild.channels.find("name", "rules")) {
            send += "\nThere already seems to be a rules channel.";
        } else {
            send += "\nNo rules channel seems to exist.";
        }
        if (guild.channels.find(c => c.name === "delete-logs")) {
            send += "\nDelete logs already seem to exist.";
        } else {
            send += "\nNo delete logs channel exists.";
        }
        cha.send(send);
    }
    if (cmd === "help") {
        const help = new Discord.RichEmbed()
            .setColor('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
            .setTitle("Helper Bot Commands")
            .setDescription("Server Helper is a bot designed to set up the most basic parts of a new server.")
            .addField("sh*setup", "Sets up basic features of your new server.")
            .addField("sh*name", "Sets your server's name.")
            .addField("sh*check", "Checks if your server has what every server needs.")
            .addField("sh*invite", "Get a permanent OAuth2 link for the bot, as well as the official server.")
            .addField("sh*bot", "Check out some pages of info for my bot.")
            .addField("sh*credits", "My thanks to all who are of help to me during my development. Also, come meet me in those places!");
        if (msg.channel.parent.id === "356555763382091776") {
            help.addField("sh*fn", "Automatically does everything to verify in Discord Bots.");
        }
        cha.send(help);
    }
    if (cmd === "invite") {
        const inv = new Discord.RichEmbed()
            .setColor('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
            .setDescription("You may add the bot to your own new server here: https://discordapp.com/api/oauth2/authorize?client_id=665029968979558409&permissions=8&scope=bot\n\nJoin the official server here (WIP): https://discord.gg/aTevuAW");
        cha.send(inv);
    }
    if (cmd === "bot") {
        const bot2 = new Discord.RichEmbed()
            .setColor('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
            .setDescription("Check it out on discord bots: https://discord.bots.gg/bots/665029968979558409\n\nCheck out the repository: https://github.com/side-special7999/helperbot");
        cha.send(bot2);
    }
    if (cmd === "credits") {
        const cred = new Discord.RichEmbed()
            .setColor('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
            .setDescription("Thanks to discord bots for helping me test: https://discord.gg/0cDvIgU2voWn4BaD\n\nThanks to the API experts for helping with API issues: https://discord.gg/discord-api\n\nBIG thanks to discord.js docs: https://discord.js.org");
        cha.send(cred);
    }
});
bot.login("");
