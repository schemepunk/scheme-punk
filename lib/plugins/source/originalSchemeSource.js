'use strict';

/**
 * This is a source mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Function to set orignal scheme as the origin.
   */
  setOrigin() {
    this.retrievedOrigin = this.scheme.originalScheme;
    if (super.setOrigin) super.setOrigin(this.retrievedOrigin);
  }
};
