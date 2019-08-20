'use strict';

const _ = require('lodash');
/**
 * This is a transformation mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = (superclass) => class extends superclass {
  /**
     * Function to transform a value by filtering out/for matches depending on
     *   options.
     * @param value
     *  A value to perform a transformation upon.
     */
  async transform(value) {
    // These are the keys of the items we will filter out or for.
    const filterItems = _.get(this, 'options.filterItems', []);
    // This is the bias.
    const filterBias = _.get(this, 'options.filterBias', 'out');

    const tempValue = _.pickBy(value, (predicate) => {
      const filterPath = Object.keys(predicate)
        .find((predicateKey) => filterItems.find(
          (fullPath) => fullPath.startsWith(predicateKey)
        ));
      return (
        (filterBias === 'out' && !_.get(predicate, filterPath))
          || (filterBias !== 'out' && _.get(predicate, filterPath))
      );
    });

    return super.transform(tempValue);
  }
};
