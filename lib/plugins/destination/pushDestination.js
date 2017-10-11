'use strict';

const _ = require('lodash');
/**
 * This is a destination mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Function to merge the value into the target in the destination.
   */
  writeDestinationTarget() {
    // Get the existing value.
    let tmpArray = _.get(
      this.scheme[this.getDestination()],
      this.getTarget(),
      []
    );
    // Ensure it is an array.
    if (!_.isArray(tmpArray)) {
      tmpArray = [tmpArray];
    }
    // Push the provided value to the array.
    tmpArray.push(this.getValue());
    // Set this in the object.
    _.set(
      this.scheme[this.getDestination()],
      this.getTarget(),
      tmpArray
    );
  }
};
