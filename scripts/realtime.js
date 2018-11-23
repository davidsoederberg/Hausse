const { apiKey } = require('../config');
const Stocks = require('stocks.js');
const stock = new Stocks({ 'apiKey':  apiKey });

const INTERVAL = '1min', AMOUNT = 1;

exports.realTimeSharePrice = async (ticker) => {
    return await stock.timeSeries({
        symbol: ticker,
        interval: INTERVAL,
        amount: AMOUNT,
    });
};