if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const listFunctions = require('../scripts/listFunctions');
const expect = require('chai').expect;

describe('ListFunctions test', () => {

    describe('CheckIfExist test', () => {

        it('should return true because THQ exists', async () => {
            const exist = await listFunctions.checkIfExist('thq');
            expect(exist).to.be.true;
        });

        it('should return false because abc123 does not exist', async () => {
            const exist = await listFunctions.checkIfExist('abc123');
            expect(exist).to.be.false;
        });

        it('should return false because empty is not specified', async () => {
            const exist = await listFunctions.checkIfExist('');
            expect(exist).to.be.false;
        });
    });

    describe('alreadyExistInStocks test', () => {

        const stocks = [ { 'name': 'foo' }, { 'name': 'bar' } ];

        it('should be true because foo exist in stocks', () => {
            expect(listFunctions.alreadyExistInStocks('foo', stocks)).to.be.true;
        });

        it('should return false because fooBar does not exist in stocks', () => {
            expect(listFunctions.alreadyExistInStocks('fooBar', stocks)).to.be.false;
        });

        it('should return false because empty string is never in stocks', () => {
            expect(listFunctions.alreadyExistInStocks('', stocks)).to.be.false;
        });

    });

    describe('removeExistingStock test', () => {

        const stocks = [ { name: 'foo' }, { name: 'bar' } ];
        const stockRemoved = [ { name: 'bar' } ];

        it('should return stockRemoved when foo is passed', () => {
            expect(listFunctions.removeExistingStock('foo', stocks)).to.deep.equal(stockRemoved);
        });

        it('should return stocks when fooBar is passed because it does not exist', () => {
            expect(listFunctions.removeExistingStock('fooBar', stocks)).to.be.eql(stocks);
        });

        it('should return stocks when empty string is passed because an empty string is never in stocks', () => {
            expect(listFunctions.removeExistingStock('fooBar', stocks)).to.be.eql(stocks);
        });

    });
});