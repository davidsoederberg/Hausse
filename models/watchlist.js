const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchlist = new Schema({
    userId: String,
    stocks: [{ type: String }],
});


module.exports = mongoose.model('Watchlist', watchlist);