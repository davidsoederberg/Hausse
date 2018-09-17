const stockData = require('../scripts/search');

module.exports = {
    'name': 'aktie',
    'aliases': ['stock'],
    'args': true,
    'usage': '<aktie>',
    'description': 'PLACEHOLDER',
    execute(message, args) {
        const stock = findStock(args);
        stock.then(function(res) {
            message.reply(res);
        });
    },
};

async function findStock(stockName) {
    return await stockData.search(stockName);
}

