const request = require('request');
const cheerio = require('cheerio');
// const { indexURL, indices } = require('../config');
const indicesJSON = JSON.parse(process.env.indices);
exports.indexPoints = (indexName, message) => {
    const index = indicesJSON[indexName];
    request(process.env.indexURL + index, (error, response, html) => {
        if(error) {
            console.log(error);
        }
        else {
            const $ = cheerio.load(html);
            const points = parseFloat($('.price-ticket__price').text()).toFixed(2);
            message.reply(`${indexName.toUpperCase()}: ${points}`);
        }
    });
};
