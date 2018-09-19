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
                const realTimePrice = findRealTimePrice(res[0].ticker);
                realTimePrice.then(price => {
                    message.reply(`${res[0].name}: ${price} ${res[0].currency}`);
                });
            }
            else {
                message.reply(`${res[0].name}: ${res[0].price} ${res[0].currency} (15 min delay`);
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
    if(relevantStocks.length === 0) {
        return stocks[0];
    }
    return relevantStocks;
}

function fixTicker(ticker, currency) {
    if(currency === 'SEK') {
        return ticker.substring(0, ticker.length - 3);
    }
    return ticker;
}