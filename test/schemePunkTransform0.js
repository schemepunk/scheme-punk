'use strict';

/**
 * Scheme Punk Transform Superclass.
 *
 */
module.exports = class schemePunkTransform {
  /**
   * Function to tranform a value, mixins should call super.tranform to keep
   * composition in play.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  transform(value) {
    this.value = value;
  }

  /**
   * Function to return a transformed value from the transformer.
   *
   * @return value
   *  The transformed value.
   */
  getTransformedValue() {
    return this.value;
  }
};