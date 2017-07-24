const sql = require("sqlite");

const Discord = require('discord.js');

exports.run = (client, message, args) => {
    console.log("level command");
    sql.open("../scores.sqlite");
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
        if (!row) {
            message.reply('There has been an error with sqlite... please contact @Moosecoop#3054');
        } else {
            let embed = new Discord.RichEmbed()
                .setTitle(`Level ${row.level}`)
                .setColor("#1D9533")
                .setFooter(`${message.author.username}`, message.author.avatarURL);
            message.channel.send({ embed });
        }
    });


    /*if (args) {
        let member = message.mentions.members.first();
        console.log(member.id);
        sql.get(`SELECT * FROM scores WHERE userId ="${member.id}"`).then(row => {
            if (!row) {
                message.reply('There has been an error with sqlite... please contact @Moosecoop#3054');
            } else {
                let embed = new Discord.RichEmbed()
                    .setTitle(`${member.username} is at level ${row.level}`)
                    .setColor("#1D9533")
                    .setFooter(`${member.username}`, member.avatarURL);
                message.channel.send({ embed });
                message.channel.sendEmbed({
                    "embed": {
                        "title": `Level ${row.level}`,
                        "color": 14658852,


                        "author": {
                            "name": `${message.mentions.members.first.username}`,
                            "icon_url": `${message.mentions.members.first.avatarURL}`
                        }
                    }
                })
            }
        })
    }*/
}
