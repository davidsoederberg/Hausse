const searchStock = require('./search');
const realtime = require('./realtime');

exports.findStock = async (stockName) => {
    return await searchStock.search(stockName);
};

exports.mostRelevantStocks = stocks => {
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
};

exports.singleStock = async stock => {
    const { name, currency, realTimePrice } = stock;
    let price = await stockPrice(stock).catch(e => {
        console.log(e);
        price = 'Error';
    });
    return realTimePrice ? `**${name}**: ${price}${currency}` : `**${name}**: ${price}${currency} (15 min fördröjning)`;
};

exports.multipleStocks = async stocks => {
    for(const stock of stocks) {
        let price = await stockPrice(stock).catch(e => {
            console.log(e);
            price = 'Error';
        });
        stock.foundPrice = price;
    }
    let reply = stocks.length === 1 ? '' : 'Hittade dessa: ';
    stocks.forEach(({ name, currency, foundPrice }, index) => {
        reply += `**${name}** ${foundPrice}${currency}`;
        reply += index + 1 === stocks.length ? '' : ', ';
    });
    return reply;
};

async function stockPrice(stock) {
    const { realTimePrice, ticker, price } = stock;
    if(realTimePrice) {
        try{
            const found = await realtime.realTimeSharePrice(ticker);
            return found[0].close;
        }
        catch(e) {
            return price;
        }
    }
    else {
        return price;
    }
}

exports.stockPrice = stockPrice;