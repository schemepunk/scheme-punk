'use strict';

const _ = require('lodash');
/**
 * This is a transformation mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Function to transform a value by filtering out/for matches depending on
   *   options.
   * @param value
   *  A value to perform a transformation upon.
   */
  transform(value) {
    // These are the items we will filter out or for.
    const filterItems = _.get(this, 'options.filterItems', []);
    // This is the bias.
    const filterBias = _.get(this, 'options.filterBias', 'out');

    const tempValueKeys = _.filter(
      Object.keys(value),
      (item) => {
        if (filterBias !== 'out') {
          // We want to return only the filter items
          return filterItems.indexOf(item) > -1;
        }
        return filterItems.indexOf(item) === -1;
      }
    );

    const tempValue = _.pick(value, tempValueKeys);
    // Call super.transform and pass along the new value to honor composition.
    return super.transform(tempValue);
  }
};
