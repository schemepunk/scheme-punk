'use strict';

/**
 * Scheme Punk Transform Superclass.
 *
 */
module.exports = class schemePunkTransformSuper {
  /**
   * Function to return a transformed value from the transformer.
   *
   * @return value
   *  The transformed value.
   */
  superMethod() {
    this.testPower = true;
    return this.testPower;
  }

  getTransformedValue() {
    return this.value;
  }
};
