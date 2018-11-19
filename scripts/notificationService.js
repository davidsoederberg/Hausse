const Cron = require('node-cron');
const NotificationList = require('../models/notification');
const searchPrice = require('./search');
const realTimePrice = require('./realtime');

exports.startNotificationService = (client) => {
    Cron.schedule('*/1 * * * *', () => {
        NotificationList.find({}, (err, Lists) => {
            if(err) {
                console.log(err);
            }
            else {
                Lists.forEach(userList => {
                    if(userList.active) {
                        checkPrice(userList, client);
                    }
                });
            }
        });
    });
};

function checkPrice(userList, client) {
    userList.stocks.forEach(stock => {
        const updatedPricePromise = getCurrentPrice(stock);
        updatedPricePromise.then(stockObject => {
            const updatedPrice = stockObject[0].close;
            if(Math.abs(updatedPrice - roundInterval(stock.interval, stock.lastPrice)) > stock.interval) {

                stock.lastPrice = updatedPrice;
                updateLastPrice(userList.userId, userList.stocks);

                const msgdiff = updatedPrice - stock.lastPrice > 0 ? 'upp' : 'ner';
                const msg = `${stock.name} gick ${msgdiff} till ${updatedPrice}${stock.currency}`;
                return sendDM(client, userList.userId, msg);
            }
        }).catch(e => {
            console.log(e);
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

function updateLastPrice(searchUserId, stocks) {
    NotificationList.findOne({ userId: searchUserId }, (err, userList) => {
        if(err) {
            console.log(err);
        }
        else {
            userList.stocks = stocks;
            userList.save();
        }
    });
}

function roundInterval(interval, price) {
    return parseInt(price / interval) * interval;
}