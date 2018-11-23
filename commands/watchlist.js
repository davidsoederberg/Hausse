const Watchlist = require('../models/watchlist');
const stockData = require('../scripts/search');
const sharePrice = require('../scripts/realtime');
const listFunctions = require('../scripts/listFunctions');

module.exports = {
    name: 'bevakning',
    aliases: ['watchlist', 'b'],
    args: false,
    usage: false,
    description: 'PLACEHOLDEr',
    async execute(message, args) {
        const userId = message.author.id;
        const foundWatchlist = await findOneWatchlist(userId);
        if(args.length === 0) {
            if(!foundWatchlist) {
                const newWatchlist = await createNewWatchlist(userId, null);
                return message.reply(`${newWatchlist.stocks[0].name} lades till på din bevakningslista`);
            }
            else {
                let realTimePricePromise = [];
                foundWatchlist.stocks.forEach(stock => {
                    realTimePricePromise = [ ...realTimePricePromise, stockPrice(stock)];
                });
                Promise.all(realTimePricePromise).then(prices => {
                    let reply = prices.length === 1 ? '' : 'Din bevakningslista: \n\n';
                    foundWatchlist.stocks.forEach(({ name, currency }, index) => {
                        reply += `**${name}** ${prices[index]} ${currency}\n`;
                    });
                    return message.reply(reply);
                });
            }
        }
        else {
            const stockName = args[0];
            let stocks = foundWatchlist.stocks;
            if(listFunctions.alreadyExistInStocks(stockName, stocks)) {
                stocks = listFunctions.removeExistingStock(stockName, stocks);
                await findOneAndUpdateWatchlist(userId, stocks);
                return message.reply(`${stockName} togs bort från din bevakningslista`);
            }
            else if(await (listFunctions.checkIfExist(stockName))) {
                const stockObject = await stockData.search(stockName);
                const stock = stockObject[0];
                delete stock.price;
                stocks.push(stock);
                await findOneAndUpdateWatchlist(userId, stocks);
                return message.reply(`${stockName} lades till på din bevakningslista`);
            }
            else {
                return message.reply('Ingen aktie vid det namnet eller ticker');
            }
        }
    },
};

async function createNewWatchlist(newUserId, stock) {
    const watchlist = new Watchlist();
    watchlist.userId = newUserId;
    watchlist.stocks = stock ? [stock] : [];
    return await watchlist.save();
}

async function findOneWatchlist(searchUserId) {
    return await Watchlist.findOne({ userId: searchUserId });
}

async function findOneAndUpdateWatchlist(searchUserId, newStocks) {
    return await Watchlist.findOneAndUpdate({ userId: searchUserId }, { $set: { stocks: newStocks } },
        { upsert: true });
}

async function stockPrice(stock) {
    const { realTimePrice, ticker, name } = stock;
    const stocks = await stockData.search(name);
    const price = stocks.length ? stocks[0].price : stocks.price;
    if(realTimePrice) {
        try{
            const found = await sharePrice.realTimeSharePrice(ticker);
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

