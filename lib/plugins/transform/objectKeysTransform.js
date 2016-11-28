'use strict';

/**
 * This is a transformation mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Function to tranform an object to an array of keys.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  transform(value) {
    // Set this.value to the keys of the object passed.
    this.value = Object.keys(value);
    // Call super.transform and pass along the new value to honor composition.
    return super.transform(this.value);
  }
};
