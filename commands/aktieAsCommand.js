const stockData = require('../scripts/search');
const sharePrice = require('../scripts/realtime');

module.exports = {
    'name': 'aktie',
    'aliases': ['stock'],
    'args': false,
    'usage': false,
    'description': 'PLACEHOLDER',
    execute(message, args) {
        const stocks = findStock(args);
        stocks.then(res => {
            if(res.length > 1) {
                const stocksArr = mostRelevantStock(res);
                if(!stocksArr.length && stocksArr.realtimePrice) {
                    const stock = stocksArr;
                    const realTimePrice = findRealTimePrice(stock.ticker);
                    realTimePrice.then(price => {
                        return message.reply(`${stock.name}: ${price}${stock.currency}`);
                    });
                }
                else if(!stocksArr.length) {
                    const stock = stocksArr;
                    return message.reply(`**${stock.name}**: ${stock.price}${stock.currency} (15 min fördröjning)`);
                }
                else {
                    const realTimePricePromise = [];
                    stocksArr.forEach(stock => {
                        if(stock.country === 'SE' || stock.country === 'US') {
                            const realTimePrice = findRealTimePrice(stock.ticker);
                            realTimePricePromise.push(realTimePrice);
                        }
                        else {
                            realTimePricePromise.push(new Promise(resolve => {
                                resolve(stock.price);
                            }));
                        }
                    });
                    Promise.all(realTimePricePromise).then(prices => {
                        let reply = prices.length === 1 ? '' : 'Hittade dessa: ';
                        stocksArr.forEach((stock, index) => {
                            reply += `**${stock.name}** ${prices[index]} ${stock.currency}`;
                            reply += index + 1 === stocksArr.length ? '' : ', ';
                        });
                        return message.reply(reply);
                    });
                }
            }
            else if(res[0].realtimePrice) {
                const stock = res[0];
                const realTimePrice = findRealTimePrice(stock.ticker);
                realTimePrice.then(price => {
                    message.reply(`${stock.name}: ${price}${stock.currency}`);
                });
            }
            else {
                const stock = res[0];
                message.reply(`**${stock.name}**: ${stock.price}${stock.currency} (15 min fördröjning)`);
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
        if(stock.country === 'SE') {
            relevantStocks.push(stock);
        }
    });
    return relevantStocks.length === 0 ? stocks[0] : relevantStocks;
}