const sql = require("sqlite");

const Discord = require('discord.js');

sql.open("../scores.sqlite");

exports.run = (client, message, args) => {
    sql.get("SELECT * FROM scores ORDER BY points DESC LIMIT 5").then(row => {
        const embed = new Discord.RichEmbed()
            .setTitle('Top User')
            .setColor("#1D9533")
            .addField('Leaderboard', `${row.userID}`);
        message.channel.send(embed);
    });
};
