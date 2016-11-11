'use strict';

/**
 * This is a transformation mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /*
   * Function to set orignal scheme as the origin.
   */
  setOrigin(value) {
    this.retrievedOrigin = value;
    super.setOrigin(value);
  }

  setTarg(targetValue) {
    this.schemePunkSourceTarget = targetValue;
    super.setTarget(targetValue);
  }

  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }
   // This is another likely contender for a mixin.
   // Default is to get a property on an object.
};
