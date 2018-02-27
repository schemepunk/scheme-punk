'use strict';


/**
 * Scheme Punk Transform Superclass.
 *
 */
module.exports = class schemePunkTransform {
  init(options, holdOvers = Promise.resolve({}), callPath = '') {
    this.options = options;
    this.setCallPath(callPath);
    return holdOvers.then((holdOver) => {
      this.setHoldOvers(holdOver);
      return this;
    });
  }
  /* eslint class-methods-use-this:
  ["error", { "exceptMethods": ["transform"] }]
  */
  /**
   * Function to tranform a value, mixins should call super.tranform to keep
   *   composition in play. EX: In transform plugins this.value is set
   *   to super.transform(value) thereby passing though.
   *
   * @param {Promise|*} value
   *  A value to perform a transformation upon.
   */
  transform(value) { // eslint-ignore
    return value;
  }

  /**
   * Function to return a transformed value bearing promise
   * from the transformer.
   *
   * @return {Promise|*} value
   *  The transformed value.
   */
  getTransformedValue() {
    return Promise.resolve(this.value);
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
   * @return {Promise|obj} holdOvers
   *    Returns any holdovers as a promise.
   */
  getHoldOvers() {
    return Promise.resolve(this.holdOvers);
  }
  /**
   * Sets the call path for the transform super.
   *
   * @param {string} callPath
   *   A path to use as a prefix in any config passed paths.
   */
  setCallPath(callPath) {
    this.callPath = callPath;
  }
  /**
   * Gets the call path for the transform super.
   *
   *
   * @returns {string} callPath
   */
  getCallPath() {
    return this.callPath;
  }
};
