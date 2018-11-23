const searchStock = require('./search');

exports.checkIfExist = async (stockName) => {
    const stocks = await searchStock.search(stockName);
    return stocks.length > 0;
};

exports.alreadyExistInList = (stockName, stocks) => {
    let exist = false;
    stocks.forEach(stock => {
        if(stock.name.toLowerCase().includes(stockName.toLowerCase())) {
            exist = true;
        }
    });
    return exist;
};

exports.removeExistingStock = (stockName, stocks) => {
    stocks.forEach((stock, index, object) => {
        if(stock.name.toLowerCase().includes(stockName.toLowerCase())) {
            object.splice(index, 1);
        }
    });
    return stocks;
};