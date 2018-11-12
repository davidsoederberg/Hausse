const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notification = new Schema({
    userId: String,
    stocks: [],
    active: Boolean,
});

const notificationModel = mongoose.model('Notification', notification);
module.exports = notificationModel;