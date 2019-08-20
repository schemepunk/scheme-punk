'use strict';

const _ = require('lodash');
const filterByBias = require('./helpers/filterByBias');
/**
 * This is a transformation mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = (superclass) => class extends superclass {
  /**
     * Function to transform an array or object by filtering on its values.
     * @param value
     *  A value to perform a transformation upon.
     */
  async transform(value) {
    if (typeof value !== 'object') {
      throw new Error(
        'Value must be an object or an array to filter.'
      );
    }
    let tempValues;
    // These are the items we will filter out or for.
    const filterItems = _.get(this, 'options.filterItems', []);
    // This is the bias.
    const filterBias = _.get(this, 'options.filterBias', 'out');
    if (_.isArray(value)) {
      tempValues = _.filter(value, (item) => filterByBias(item, filterItems, filterBias));
    }
    else {
      tempValues = _.pickBy(value, (val) => {
        if (filterBias !== 'out') {
          return _.includes(filterItems, val);
        }
        return !_.includes(filterItems, val);
      });
    }

    return super.transform(tempValues);
  }
};
