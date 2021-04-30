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


/**
 * Stops I/O thread
 * Is used while testing long response from server (development process)
 * @param {int} milliseconds
 */
const sleep = milliseconds => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


module.exports = {
    mongoObjectIdGenerator,
    sleep
}