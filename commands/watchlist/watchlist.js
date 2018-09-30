const Watchlist = require('../../models/watchlist');


module.exports = {
    name: 'bevakning',
    aliases: ['watchlist'],
    args: false,
    usage: false,
    description: 'PLACEHOLDEr',
    execute(message, args) {
        // TODO FIX ALL MESSAGE REPLIES
        const userId = message.author.id;
        const findOnePromise = findOneWatchlist(userId);
        findOnePromise.then(foundWatchlist => {
            if(args.length === 0) {
                if(!foundWatchlist) {
                    const createNewPromise = createNewWatchlist(userId, null);
                    createNewPromise.then(wl => {
                        return message.reply(wl.stocks);
                    });
                }
                else {
                    return message.reply(foundWatchlist.stocks.toString());
                }
            }
            else {
                const stock = args[0];
                let stocks = foundWatchlist.stocks;
                if(stocks.indexOf(stock) > -1) {
                    stocks = stocks.filter((element => element !== stock));
                }
                else {
                    stocks.push(stock);
                }
                const updatePromise = findOneAndUpdateWatchlist(userId, stocks);
                updatePromise.then(updatedWatchlist => {
                    return message.reply(updatedWatchlist.stocks);
                });
            }
        });
    },
};

async function createNewWatchlist(newUserId, stock) {
    const watchlist = new Watchlist();
    watchlist.userId = newUserId;
    watchlist.stocks = stock ? [stock] : [];
    return new Promise((resolve, reject) => {
        watchlist.save((err, wl) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(wl);
            }
        });
    });
}

async function findOneWatchlist(searchUserId) {
    return new Promise((resolve, reject) => {
        Watchlist.findOne({ userId: searchUserId })
            .exec((err, foundWatchlist) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(foundWatchlist);
                }
            });
    });
}

async function findOneAndUpdateWatchlist(searchUserId, newStocks) {
    return new Promise((resolve, reject) => {
        Watchlist.findOneAndUpdate({ userId: searchUserId }, { $set: { stocks: newStocks } },
            { upsert: true, new: true }, (err, wl) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(wl);
                }
            });
    });
}

