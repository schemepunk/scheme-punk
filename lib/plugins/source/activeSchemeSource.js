'use strict';

/**
 * This is a source mixin for SchemePunk. Which uses the active scheme as the
 * source rather than the original source.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
     * Function to set the active scheme as the origin.
     */
  setOrigin() {
    this.retrievedOrigin = this.scheme.activeScheme;
    if (super.setOrigin) super.setOrigin(this.retrievedOrigin);
  }
};
