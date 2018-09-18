const request = require('request');

exports.search = function(stockName) {
    return new Promise(function(resolve) {
        request(`https://www.avanza.se/_mobile/market/search/STOCK?query=${stockName}`, function(error, response, body) {
            if(error) {
                console.log(error);
            }
            else{
                const result = [];
                const stockArray = JSON.parse(body).hits[0].topHits.slice(0, 2);
                stockArray.forEach((stock, index) => {
                    console.log(stock);
                    const stockObject = {};
                    stockObject.ticker = stock.tickerSymbol.replace(' ', '-');
                    stockObject.name = stock.name;
                    result[index] = stockObject;
                });
                resolve(result);
            }
        });
    });
};