const Cron = require('node-cron');
const NotificationList = require('../models/notification');
const searchPrice = require('./search');
const realTimePrice = require('./realtime');

exports.startNotificationService = (client) => {
    Cron.schedule('*/5 * * * *', () => {
        NotificationList.find({}, (err, Lists) => {
            if(err) {
                console.log(err);
            }
            else {
                Lists.forEach(userList => {
                    checkPrice(userList, client);
                });
            }
        });
    });
};

function checkPrice(userList, client) {
    userList.stocks.forEach(stock => {
        const updatedPricePromise = getCurrentPrice(stock);
        updatedPricePromise.then(updatedPrice => {
            if(Math.abs(updatedPrice - stock.lastPrice) > stock.interval) {
                stock.lastPrice = updatedPrice;
                userList.save();

                const msgdiff = updatedPrice - stock.lastPrice > 0 ? 'upp' : 'ner';
                const msg = `${stock.name} gick ${msgdiff} till ${updatedPrice}${stock.currency}`;
                return sendDM(client, userList.userId, msg);
            }
        });
    });
}

function sendDM(client, userId, msg) {
    client.fetchUser(userId).then((user) => {
        user.send(msg);
    });
}

async function getCurrentPrice(stock) {
    if(stock.realTimePrice) {
        return await realTimePrice.realTimeSharePrice(stock.ticker);
    }
    else {
        return searchPrice.search(stock.name);
    }
}