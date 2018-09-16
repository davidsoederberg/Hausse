const request = require('request');

request('https://www.avanza.se/_mobile/market/search/STOCK?query=apple', function(error, response, body) {
    if(error) {
        console.log(error);
    }
    else{
        const hits = JSON.parse(body);
        console.log(hits.hits[0].topHits);
    }
});