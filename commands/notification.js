const NotificationList = require('../models/notification');
const searchStock = require('../scripts/search');

module.exports = {
    'name': 'notification',
    'aliases': ['notis'],
    'args': false,
    'usage': false,
    'description': 'PLACEHOLDER',
    async execute(message, args) {
        const userId = message.author.id;
        const userNotification = await findNotificationList(userId);
        if(!userNotification) {
            createNotificationList(userId);
            return message.reply('Notisfunktionen är aktiverad. Lägg till aktier med: \n !notis <aktie> <intervall> ');
        }
        else if(args.length === 0) {
            await toggleNotification(userId);
            const { active } = await findNotificationList(userId);
            const msg = active ? 'aktiverad' : 'deaktiverad';
            return message.reply(`Notisfunktionen har blivit ${msg}`);
        }
        else {
            const stockName = args[0];
            const interval = args[1];
            if(await checkIfExist(stockName) || interval <= 0) {
                await updateNotificationList(userId, stockName, interval);
                return message.reply('Din notificationslista har blivit uppdaterad');
            }
            else {
                return message.reply('Ingen aktie vid det namnet eller fel interval');
            }
        }
    },
};

async function findNotificationList(searchUserId) {
    return await NotificationList.findOne({ userId: searchUserId });
}

function createNotificationList(newUserId) {
    const notificationList = new NotificationList();
    notificationList.userId = newUserId;
    notificationList.active = true;
    notificationList.save();
}

async function toggleNotification(searchUserId) {
    NotificationList.findOne({ userId: searchUserId }, (err, userNotification) => {
        if(err) {
            console.log(err);
        }
        else {
            userNotification.active = !userNotification.active;
            userNotification.save();
        }
    });
}

async function updateNotificationList(searchUserId, stockName, interval) {
    const foundStocks = await searchStock.search(stockName);
    const stock = foundStocks[0];
    stock.interval = interval;
    stock.lastPrice = stock.price;
    delete stock.price;
    NotificationList.findOne({ userId: searchUserId }, (err, userNotification) => {
        if(err) {
            console.log(err);
        }
        else {
            const stocks = userNotification.stocks;
            if(!alreadyExistInNotificationList(stockName, userNotification.stocks)) {
                userNotification.stocks.push(stock);
                userNotification.save();
            }
            else {
                userNotification.stocks = removeExistingStock(stockName, stocks);
                userNotification.save();
            }
        }
    });
}

async function checkIfExist(stockName) {
    const stocks = await searchStock.search(stockName);
    return stocks.length > 0;
}

function alreadyExistInNotificationList(stockName, stocks) {
    let exist = false;
    stocks.forEach(stock => {
        if(stock.name.toLowerCase().includes(stockName.toLowerCase())) {
            exist = true;
        }
    });
    return exist;
}

function removeExistingStock(stockName, stocks) {
    stocks.forEach((stock, index, object) => {
        if(stock.name.toLowerCase().includes(stockName.toLowerCase())) {
            object.splice(index, 1);
        }
    });
    return stocks;
}