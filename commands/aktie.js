const stockData = require('../scripts/search');
const sharePrice = require('../scripts/realtime');

module.exports = {
    'name': 'aktie',
    'aliases': ['stock'],
    'args': true,
    'usage': '<aktie>',
    'description': 'PLACEHOLDER',
    execute(message, args) {
        const stocks = findStock(args);
        stocks.then(res => {
            const stocksArr = mostRelevantStock(res);
            if(stocksArr.length > 1) {
                let stocksFound = '';
                stocksArr.forEach(stock => {
                    const ticker = fixTicker(stock.ticker, stock.currency);
                    stocksFound += `**${stock.name}**: (${ticker}), `;
                });
                return message.reply(`Hittade dessa: ${stocksFound}`);
            }
            else if(res[0].realtimePrice) {
                const stock = res[0];
                const realTimePrice = findRealTimePrice(stock.ticker);
                realTimePrice.then(price => {
                    message.reply(`${stock.name}: ${price} ${stock.currency}`);
                });
            }
            else {
                const stock = res[0];
                message.reply(`${stock.name}: ${stock.price} ${stock.currency} (15 min fördröjning)`);
            }
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

function mostRelevantStock(stocks) {
    const relevantStocks = [];
    stocks.forEach(stock => {
        if(stock.currency === 'SEK') {
            relevantStocks.push(stock);
        }
    });
    return relevantStocks.length === 0 ? stocks[0] : relevantStocks;
}

function fixTicker(ticker, currency) {
    return currency === 'SEK' ? ticker.substring(0, ticker.length - 3) : ticker;
}