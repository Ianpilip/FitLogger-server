/**
 * Generates random ObjectId
 * Is used while creating api (development process)
 * Example of usage:
 * const mongoose = require('mongoose')
 * mongoose.Types.ObjectId(mongoObjectIdGenerator())
 *
 * @return {String}
 */
const mongoObjectIdGenerator = () => {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

module.exports = {
    mongoObjectIdGenerator
}