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
     * Function to transform a value by prepending a string
     *   to a key, array member or string. This.options will
     *     need a prependValue in order to work with this
     *       transform.
     *
     * @param value
     *  A value to perform a transformation upon.
     */
  async transform(value = []) {
    const delimiter = _.get(this, 'options.sourceDelimiter', ',');
    const tempValue = value.join(delimiter);
    // Call super.transform and pass along the new value to honor composition.
    return super.transform(tempValue);
  }
};
