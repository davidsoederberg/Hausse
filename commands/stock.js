const stockData = require('../scripts/search');
const sharePrice = require('../scripts/realtime');

module.exports = {
    'name': 'stock',
    'aliases': ['aktie'],
    'args': true,
    'usage': '<aktie>',
    'description': 'PLACEHOLDER',
    execute(message, args) {
        const stocks = findStock(args);
        stocks.then(res => {
            const stocksArr = mostRelevantStock(res);
            if(!stocksArr.length) {
                // Single stock found
                return singleStock(stocksArr, message);
            }
            else {
                console.log(stocksArr);
                // Multiple stocks found
                return multipleStocks(stocksArr, message);
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
    if(stocks.length === 1) {
        return stocks[0];
    }
    else {
        let relevantStocks = [];
        stocks.forEach(stock => {
            if (stock.country === 'SE') {
                relevantStocks = [...relevantStocks, stock];
            }
        });
        return relevantStocks.length === 0 ? stocks[0] : relevantStocks;
    }
}

function singleStock(stock, message) {
    const { name, currency, realTimePrice } = stock;
    const pricePromise = stockPrice(stock);
    pricePromise
        .then(price => {
            const reply = realTimePrice ? `**${name}**: ${price}${currency}` : `**${name}**: ${price}${currency} (15 min fördröjning)`;
            return message.reply(reply);
        })
        .catch(() => {
            return message.reply('Error');
        });
}

function multipleStocks(stocksArr, message) {
    let realTimePricePromise = [];
    stocksArr.forEach((stock) => {
        realTimePricePromise = [ ...realTimePricePromise, stockPrice(stock)];
    });
    Promise.all(realTimePricePromise).then(prices => {
        let reply = prices.length === 1 ? '' : 'Hittade dessa: ';
        stocksArr.forEach(({ name, currency }, index) => {
            reply += `**${name}** ${prices[index]} ${currency}`;
            reply += index + 1 === stocksArr.length ? '' : ', ';
        });
        return message.reply(reply);
    });
}

async function stockPrice(stock) {
    const { realTimePrice, ticker, price } = stock;
    if(realTimePrice) {
        const realTimePricePromise = findRealTimePrice(ticker);
        return await realTimePricePromise.then(resolve => {
            return resolve;
        })
            .catch(() => {
                return price;
            });
    }
    else {
        return price;
    }
}