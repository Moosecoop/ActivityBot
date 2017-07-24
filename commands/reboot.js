exports.run = (client, message, args) => {
    if (!message.author.id == config.discord.owner.id) return message.reply('ERR: You do not have the permissions to do that!');
    msg.channel.send("Rebooting...")
    .then(() => {
      process.exit();
    })
    .catch((e) => {
      console.error(e);
    });
};