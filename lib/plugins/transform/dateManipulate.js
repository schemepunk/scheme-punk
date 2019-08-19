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
  async transform(value) {
    // options.timeManipulator

    const manipulator = _.get(this, ['options', 'manipulator'], false);
    const manipulatorArgs = _.get(this, ['options', 'manipulatorArgs'], false);

    if (
      (!manipulator || !manipulatorArgs)
      || _.indexOf(['add', 'subtract', 'startOf', 'endOf', 'local'], manipulator) < 0) {
      return super.transform(value);
    }

    let tmpValue;

    if (_.isArray(manipulatorArgs)) {
      tmpValue = value[manipulator](...manipulatorArgs);
    }
    else {
      // for objects and strings
      tmpValue = value[manipulator](manipulatorArgs);
    }
    return super.transform(tmpValue);
  }
};
