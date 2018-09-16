const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
const { prefix, token } = require('./config');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.on('ready', () => {
    console.log('Ready!');
});

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    if (falseArguments(command, args, message)) {
        return;
    }
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.log(error);
        message.reply('error');
    }
});


function falseArguments(command, args, message) {
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        message.channel.send(reply);
        return command.args && !args.length;
    }
}

client.login(token);
