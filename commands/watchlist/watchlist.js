const Watchlist = require('../../models/watchlist');
const stockData = require('../../scripts/search');
const sharePrice = require('../../scripts/realtime');

module.exports = {
    name: 'bevakning',
    aliases: ['watchlist'],
    args: false,
    usage: false,
    description: 'PLACEHOLDEr',
    async execute(message, args) {
        // TODO FIX ALL MESSAGE REPLIES
        // TODO do not add to watchlist if it does not exist
        // TODO create with args
        const userId = message.author.id;
        const foundWatchlist = await findOneWatchlist(userId);
        if(args.length === 0) {
            if(!foundWatchlist) {
                const newWatchlist = await createNewWatchlist(userId, null);
                return message.reply(newWatchlist.stocks);
            }
            else {
                return message.reply(foundWatchlist.stocks.toString());
            }
        }
        else {
            const stockName = args[0];
            let stocks = foundWatchlist.stocks;
            if(stocks.indexOf(stockName) > -1) {
                stocks = stocks.filter((element => element !== stockName));
            }
            else {
                const stockObject = await stockData.search(stockName);
                const stock = stockObject[0];
                delete stock.price;
                stocks.push(stock);
            }
            const updatedWatchlist = await findOneAndUpdateWatchlist(userId, stocks);
            return message.reply(updatedWatchlist.stocks);
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
        { upsert: true, new: true });
}

