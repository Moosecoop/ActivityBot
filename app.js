const Discord = require('discord.js');
const sql = require("sqlite");
const table = require('table');
const fs = require("fs");

sql.open("./scores.sqlite");
const config = require('./config.json');
let token = config.discord.token;

const client = new Discord.Client();

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        // super-secret recipe to call events with all their proper arguments *after* the `client` var.
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});

client.on("message", message => {
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO scores (userId, points, level, username) VALUES (?, ?, ?, ?)", [message.author.id, 1, 0, message.author.username]);
        } else {
            let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
            if (curLevel > row.level) {
                row.level = curLevel;
                sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
                const embed = new Discord.RichEmbed()
                    .setTitle("You leveled up!")
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .footer(`You're now level ${row.level}`)
                    .setColor("#1D9533");
                message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
                message.channel.send({embed});
            }
            sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
        }
    }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER, username STRING)").then(() => {
            sql.run("INSERT INTO scores (userId, points, level, username) VALUES (?, ?, ?, ?)", [message.author.id, 1, 0, message.author.username]);
        });
    });

    if (message.author.bot) return;
    if (message.content.indexOf(config.discord.prefix) !== 0) return;

    // This is the best way to define args. Trust me.
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(config.discord.prefix.length).toLowerCase();

    // The list of if/else is replaced with those simple 2 lines:
    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.error(err);
        let embed = new Discord.RichEmbed()
            .setAuthor('ERR', '../images/err.png')
            .addField('Error:', `\`\`\`${err}\`\`\``)
            .setTimestamp()
            .setColor("#1D9533");

        message.channel.send({embed});
    }
});

/*dClient.on("message", message => {
    if (message.author.bot) return;
    if (message.channel.type !== "text") return;

    if (message.content.startsWith(prefix + "ping")) {
        message.reply("pong!");
        let embed = new Discord.RichEmbed()
            .addField('Ping', `${dClient.ping}`)
            .setColor("#1D9533")
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);
    }

    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        } else {
            let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
            if (curLevel > row.level) {
                row.level = curLevel;
                sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
                message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
            }
            sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
        }
    }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
            sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        });
    });



    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(prefix + "level")) {
        sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
            if (!row) {
                let embed = new Discord.RichEmbed()
                    .addField('Level', row.level)
                    .setColor("#1D9533")
                    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);
                message.channel.send({ embed });
            }

        });
    } else

        if (message.content.startsWith(prefix + "points")) {
            sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
                if (!row) {
                    message.reply(`you currently have ${row.points} points, good going!`);
                    let embed = new Discord.RichEmbed()
                        .addField('Points', row.points)
                        .setColor("#1D9533")
                        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL);
                    message.channel.send({ embed });
                }

            });

        } else if (message.content.startsWith(prefix + "restart" || prefix + "reboot")) {
            if (message.author.id == config.discord.owner.id) {
                message.channel.send("Rebooting...")
                    .then(() => {
                        process.exit();
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            } else {
                message.reply(`\`\`\`ERR:\nYou do not have the permissions to do this command!\`\`\``);
            }
        } else if (message.content.startsWith(prefix + "uptime")) {

        }

});*/

client.on('ready', () => {
    console.log("READY DISCORD!");
});

process.on('unhandledRejection', console.error);

client.login(token);