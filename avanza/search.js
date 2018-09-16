const request = require('request');

exports.search = function(stockName) {
    return new Promise(function(resolve) {
        request(`https://www.avanza.se/_mobile/market/search/STOCK?query=${stockName}`, function(error, response, body) {
            if(error) {
                console.log(error);
            }
            else{
                const hits = JSON.parse(body);
                resolve(hits.hits[0].topHits[0].name.toString());
            }
        });
    });
};