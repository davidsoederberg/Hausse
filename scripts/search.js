const request = require('request');

exports.search = function(stockName) {
    return new Promise(function(resolve, reject) {
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
                stockArray.forEach((stock, index) => {
                    const stockObject = buildStockObject(stock);
                    if(!stockObject) {
                        return reject('Tyvärr så fungerar bara USA eller Sverige aktier just nu :C');
                    }
                    result[index] = stockObject;
                });
                resolve(result);
            }
        });
    });
};

function buildStockObject(stock) {
    const stockObject = {};
    if(stock.flagCode === 'US' || stock.flagCode === 'SE') {
        stockObject.name = stock.name;
        stockObject.currency = stock.currency;
        stockObject.ticker = stock.tickerSymbol.replace(' ', '-');
        if(stock.flagCode === 'SE') {
            stockObject.ticker = stockObject.ticker.concat('.st');
        }
        return stockObject;
    }
    else {
        return false;
    }
}
