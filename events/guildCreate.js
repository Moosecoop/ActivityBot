const Discord = require('discord.js');

exports.run = (client, guild) => {
    let embed = new Discord.RichEmbed()
        .setTitle('Hi! I\'m Activity Bot!')
        .setColor("#1D9533")
        .setDescription(`Hi! I'm activity bot! I track server activity. If you need help email bots@moosehub.xyz or do \`_help\` `);
    guild.defaultChannel.send({ embed });
}