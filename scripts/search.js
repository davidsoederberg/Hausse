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
                for(let i = 0; i < stockArray.length; i++) {
                    const stockObject = {};
                    stockObject.ticker = stockArray[i].tickerSymbol;
                    stockObject.name = stockArray[i].name;
                    result[i] = stockObject;
                }
                resolve(result);
            }
        });
    });
};