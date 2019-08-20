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
module.exports = (superclass) => class extends superclass {
  /**
     * Function to transform a date passed in from the source
     *   into a parsed date object.
     *
     * @param value
     *  A value to perform a transformation upon.
     */
  async transform(value) {
    const tmpValue = value || moment().format();

    const args = [].push(tmpValue);

    if (_.get(this, 'options.inputFormat', null)) {
      args.push(_.get(this, 'options.inputFormat'));
    }

    const tmp = moment(...args);

    if (_.get(this, 'options.inputUseUtc', false)) {
      tmp.utc();
    }

    if (tmp.isValid()) {
      return super.transform(tmp);
    }

    throw new Error(`The data passed to the date formatter could not be transformed into valid date.`);
  }
};
