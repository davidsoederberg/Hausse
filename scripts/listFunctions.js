const searchStock = require('./search');

exports.checkIfExist = async (stockName) => {
    try{
        const stocks = await searchStock.search(stockName);
        return stocks.length > 0;
    }
    catch(e) {
        return false;
    }
};

exports.alreadyExistInStocks = (stockName, stocks) => {
    if(stockName.length === 0) {
        return false;
    }
    let exist = false;
    stocks.forEach(stock => {
        if(stock.name.toLowerCase().includes(stockName.toLowerCase())) {
            exist = true;
        }
    });
    return exist;
};

exports.removeExistingStock = (stockName, stocks) => {
    if(stockName.length === 0) {
        return stocks;
    }
    stocks.forEach((stock, index, object) => {
        if(stock.name.toLowerCase().includes(stockName.toLowerCase())) {
            object.splice(index, 1);
        }
    });
    return stocks;
};