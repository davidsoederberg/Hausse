const config = require('../config');
const Stocks = require('stocks.js');
const stock = new Stocks({ 'apiKey': config.apiKey });

const INTERVAL = '1min', AMOUNT = 1;

exports.realTimeSharePrice = async (ticker) => {
    return stock.timeSeries({
        symbol: ticker,
        interval: INTERVAL,
        amount: AMOUNT,
    });
};