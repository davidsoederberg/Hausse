const stockFunctions = require('../scripts/stockFunctions');

module.exports = {
    'name': 'stock',
    'aliases': ['aktie'],
    'args': true,
    'usage': '<aktie>',
    'description': 'PLACEHOLDER',
    async execute(message, args) {
        return message.reply(await stockController(args));
    },
};


async function stockController(args) {
    try{
        const stocks = await stockFunctions.findStock(args);
        const relevantStocks = stockFunctions.mostRelevantStocks(stocks);
        if(!relevantStocks.length) {
            return await stockFunctions.singleStock(relevantStocks);
        }
        else {
            return await stockFunctions.multipleStocks(relevantStocks);
        }
    }
    catch(e) {
        return e;
    }
}