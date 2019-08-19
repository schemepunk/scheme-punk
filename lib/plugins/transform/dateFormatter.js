'use strict';

const _ = require('lodash');
const moment = require('moment');
/**
 * This is a transformation mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
     * Function to transform a date value into the format
     *   provided in the options.
     *
     * @param value
     *  A value to perform a transformation upon.
     */
  async transform(value = moment()) {
    const outGoingFormat = _.get(this, ['options', 'outputFormat'], false);
    if (!outGoingFormat) {
      return super.transform(value.format());
    }
    // Call super.transform and pass along the new value to honor composition.
    return super.transform(value.format(outGoingFormat));
  }
};
