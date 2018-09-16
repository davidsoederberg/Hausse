const { prefix } = require('../auth/discordBot.json');

module.exports = {
    name: 'help',
    aliases: ['commands'],
    args: false,
    usage: '[command name]',
    description: 'Lista över användbara kommandon eller info om ett specifikt kommando',
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Här en lista av alla kommandon:\n');
            data.push(commands.map(command => command.name).join('\n'));
            data.push(`\nDu kan skriva \`${prefix}help [command name]\` för info av ett specifikt kommando!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch((error) => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('Verkar som jag inte kan skicka DM till dig med hjälp, har du stängt av DM funktionen?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('Kommandot finns inte.');
        }

        data.push(`**Kommando:** ${command.name}`);

        if (command.aliases) data.push(`**Andra namn:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Beskrivning:** ${command.description}`);
        if (command.usage) data.push(`**Argument:** ${prefix}${command.name} ${command.usage}`);

        // data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
    },
};
