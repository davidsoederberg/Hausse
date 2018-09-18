const stockData = require('../scripts/search');
const sharePrice = require('../scripts/realtime');

module.exports = {
    'name': 'aktie',
    'aliases': ['stock'],
    'args': true,
    'usage': '<aktie>',
    'description': 'PLACEHOLDER',
    execute(message, args) {
        const stock = findStock(args);
        stock.then(res => {
            const realTimePrice = findRealTimePrice(res[0].ticker);
            realTimePrice.then(price => {
                message.reply(`${res[0].name}: ${price} ${res[0].currency}`);
            });
        }).catch(reject => {
            message.reply(reject);
        });
    },
};

async function findStock(stockName) {
    return await stockData.search(stockName);
}

async function findRealTimePrice(ticker) {
    const realTimePrice = await sharePrice.realTimeSharePrice(ticker);
    return realTimePrice[0].close;
}
