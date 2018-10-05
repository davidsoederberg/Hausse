const stock = require('./stock.js');

module.exports = {
    'name': 'stockAsCommand',
    'aliases': [],
    'args': false,
    'usage': false,
    'description': 'PLACEHOLDER',
    execute(message, args) {
        stock.execute(message, args);
    },
};