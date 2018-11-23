const request = require('request');
// const { searchURL } = require('../config');
exports.search = function(stockName) {
    return new Promise((resolve, reject) => {
        request(process.env.searchURL + stockName, (error, response, body) => {
            if(error) {
                return reject('ERROR');
            }
            else{
                let result = [];
                const data = JSON.parse(body);
                if(data.totalNumberOfHits === 0) {
                    return reject('Ingen träff');
                }
                const stockArray = data.hits[0].topHits.slice(0, 3);
                stockArray.forEach(stock => {
                    result = [ ...result, buildStockObject(stock) ];
                });
                resolve(result);
            }
        });
    });
};

function buildStockObject(stock) {
    const { name, currency, flagCode, tickerSymbol, lastPrice } = stock;
    const stockObject = {};
    stockObject.name = name;
    stockObject.currency = currency;
    stockObject.ticker = flagCode === 'SE' ? tickerSymbol.replace(' ', '-').concat('.st') : tickerSymbol.replace(' ', '-');
    stockObject.realTimePrice = (flagCode === 'US' || flagCode === 'SE');
    stockObject.price = lastPrice;
    stockObject.country = flagCode;
    return stockObject;
}
