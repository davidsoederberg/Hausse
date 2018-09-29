const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchlist = new Schema({
    userId: String,
    stocks: [{ type: String }],
});

const watchlistModel = mongoose.model('Watchlist', watchlist)
module.exports = watchlistModel;