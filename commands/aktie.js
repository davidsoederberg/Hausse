module.exports = {
    'name': 'aktie',
    'aliases': ['stocks'],
    'args': true,
    'usage': '<aktie>',
    'description': 'PLACEHOLDER',
    execute(message, args) {
        const stock = getStock(args);
        if(!stock) {
            return message.channel.send('Hittar ej');
        }
    },
};

function getStock() {
    return undefined;
}