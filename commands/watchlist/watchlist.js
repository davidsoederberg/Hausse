const Watchlist = require('../../models/watchlist');


module.exports = {
    name: 'bevakning',
    aliases: ['watchlist'],
    args: false,
    usage: false,
    description: 'PLACEHOLDEr',
    execute(message, args) {
        Watchlist.findOne({ userId: message.author.id })
            .exec((err, foundWatchlist) => {
                if(err) {
                    console.log(err);
                }
                else if(!foundWatchlist) {
                    const watchlist = new Watchlist();
                    watchlist.userId = message.author.id;
                    watchlist.stocks = [];
                    watchlist.save((err, wl) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(foundWatchlist);
                            return message.reply('Skapade en watchlist');
                        }
                    });
                }
                else {
                    console.log(foundWatchlist);
                    return message.reply(foundWatchlist.stocks.toString());
                }
            });

    },
};
