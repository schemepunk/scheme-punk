'use strict';


/**
 * Scheme Punk Transform Superclass.
 *
 */
module.exports = class schemePunkTransform {
  constructor(options, holdOvers) {
    this.options = options;
    let holdOversCall = {};
    if (holdOvers) {
      holdOversCall = holdOvers;
    }
    this.setHoldOvers(holdOversCall);
  }
  /* eslint class-methods-use-this:
  ["error", { "exceptMethods": ["transform"] }]
  */
  /**
   * Function to tranform a value, mixins should call super.tranform to keep
   * composition in play.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  transform(value) { // eslint-ignore
    return value;
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

  /**
   * setHoldovers - sets holdOvers for transform.
   *
   * @param  obj holdOvers
   *   An object of holdOver keys for use with transforms and destinations.
   *
   */
  setHoldOvers(holdOvers) {
    this.holdOvers = holdOvers;
  }

  /**
   * getHoldOvers gets the holdOvers for schemePunk transform.
   *
   * @return obj holdOvers
   *    Gets the holdOvers object.
   */
  getHoldOvers() {
    return this.holdOvers;
  }
};
