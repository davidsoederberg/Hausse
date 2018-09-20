const request = require('request');

exports.search = function(stockName) {
    return new Promise((resolve, reject) => {
        request(`https://www.avanza.se/_mobile/market/search/STOCK?query=${stockName}`, (error, response, body) => {
            if(error) {
                return reject('ERROR');
            }
            else{
                const result = [];
                const data = JSON.parse(body);
                if(data.totalNumberOfHits === 0) {
                    return reject('Ingen träff');
                }
                const stockArray = data.hits[0].topHits.slice(0, 3);
                stockArray.forEach(stock => {
                    const stockObject = buildStockObject(stock);
                    result.push(stockObject);
                });
                resolve(result);
            }
        });
    });
};

function buildStockObject(stock) {
    const stockObject = {};
    stockObject.name = stock.name;
    stockObject.currency = stock.currency;
    stockObject.ticker = stock.flagCode === 'SE' ? stock.tickerSymbol.replace(' ', '-').concat('.st') : stock.tickerSymbol.replace(' ', '-');
    stockObject.realtimePrice = (stock.flagCode === 'US' || stock.flagCode === 'SE');
    stockObject.price = stock.lastPrice;
    stockObject.country = stock.flagCode;
    return stockObject;
}
