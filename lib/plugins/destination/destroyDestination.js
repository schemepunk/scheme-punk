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
     * Function to destroy target at destination
     */
  writeDestinationTarget() {
    _.unset(this.scheme[this.getDestination()], this.getTarget());
  }
};
