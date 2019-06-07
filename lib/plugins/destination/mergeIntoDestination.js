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
    _.set(
      this.scheme[this.getDestination()],
      this.getTarget(),
      _.merge(
        {},
        _.get(this.scheme[this.getDestination()], this.getTarget()),
        this.getValue()
      )
    );
  }
};
