/**
 * Group by property (including nested properties)
 * Set the param about property (nested property) like that - 'prop1.prop2.prop3'
 * Below is the usage example
 * @param {Array} array
 * @param {String} key
 * @return {Object}
 */
const groupBy = (array, key) => {

    const _fetchFromObject = (obj, prop) => {
        let _index = prop.indexOf('.');

        // nested property was found, use a recursive
        if(_index > -1) {
            // get an object from the property, return a remainder
            return _fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
        }

        // if there wasn't nested properties
        return obj[prop];
    }

    return array.reduce((result, currentValue) => {
        let search;
        let _index = key.indexOf('.');
        if(_index < 0) {
            search = currentValue[key];
        } else {
            search = _fetchFromObject(currentValue, key);
        }
        result[search] = [...result[search] || [], currentValue];
        return result;
    }, {});

};

/**
 * Sort array of object by property
 * @param {Array} array
 * @param {String} key
 * @return {Array}
 */
const sortByKey = (array, key) => {
    return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

module.exports = {
    groupBy,
    sortByKey,
}