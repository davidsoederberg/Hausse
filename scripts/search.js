const request = require('request');

exports.search = function(stockName) {
    return new Promise(function(resolve, reject) {
        request(`https://www.avanza.se/_mobile/market/search/STOCK?query=${stockName}`, function(error, response, body) {
            if(error) {
                console.log(error);
            }
            else{
                const result = [];
                const stockArray = JSON.parse(body).hits[0].topHits.slice(0, 1);
                stockArray.forEach((stock, index) => {
                    const stockObject = buildStockObject(stock);
                    if(!stockObject) {
                        reject();
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
