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
     * Function to transform a value by prepending a string
     *   to a key, array member or string. This.options will
     *     need a prependValue in order to work with this
     *       transform.
     *
     * @param value
     *  A value to perform a transformation upon.
     */
  async transform(value) {
    // options.timeManipulator

    const manipulator = _.get(this, ['options', 'manipulator']);
    const manipulatorArgs = _.get(this, ['options', 'manipulatorArgs']);

    if (_.indexOf(['add', 'subtract', 'startOf', 'endOf', 'local'], manipulator) < 0) {
      return super.transform(value);
    }

    let tmp;

    if (_.isArray(manipulatorArgs)) {
      tmp = value[manipulator](...manipulatorArgs);
    }
    else {
      tmp = value[manipulator](manipulatorArgs);
    }

    return super.transform(tmp);
  }
};
