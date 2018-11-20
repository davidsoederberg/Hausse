const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const NotifcationService = require('./scripts/notificationService');
const client = new Discord.Client();
const indexPoints = require('./scripts/indexPoints');

const prefix = '!';
const token = process.env.token;
const database = process.env.database;
const indices = JSON.parse(process.env.indices);

const stockAsCommand = require('./commands/stockAsCommand');

// DATABASE
mongoose.Promise = global.Promise;
mongoose.connect(database, { useNewUrlParser: true });

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.on('ready', () => {
    console.log('Starting bot...');
    NotifcationService.startNotificationService(client);
    console.log('Notification service started');
});

for (const file of commandFiles) {
    let command;
    try {
        command = require(`./commands/${file}`);
    }
    catch(err) {
        command = require(`./commands/watchlist/${file}`);
    }
    client.commands.set(command.name, command);
}

client.on('message', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // If commandName is in the array of indices available
    if(Object.keys(indices).indexOf(commandName) > -1) {
        indexPoints.indexPoints(commandName, message);
        return;
    }

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) {
        stockAsCommand.execute(message, commandName);
        return;
    }

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
