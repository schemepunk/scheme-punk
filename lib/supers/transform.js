'use strict';


/**
 * Scheme Punk Transform Superclass.
 *
 */
module.exports = class schemePunkTransform {
  async init(options, holdOvers = {}, callPath = '', templateObject = false) {
    this.options = options;
    this.setCallPath(callPath);
    this.setTemplateObject(templateObject);
    await holdOvers;
    this.setHoldOvers(holdOvers);
    return this;
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
  async transform(value) { // eslint-ignore
    return value;
  }

  /**
   * Function to return a transformed value bearing promise
   * from the transformer.
   *
   * @return {Promise|*} value
   *  The transformed value.
   */
  async getTransformedValue() {
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
   * @return {Promise|obj} holdOvers
   *    Returns any holdovers as a promise.
   */
  async getHoldOvers() {
    return this.holdOvers;
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

  /**
   * Sets the template object for this transform
   *
   * @param {Object} templateObject
   *   A template object object.
   */
  setTemplateObject(templateObject) {
    this.templateObject = templateObject;
  }

  /**
   * Gets the template object for this transform.
   *
   * @returns {Object}
   *   Returns the template object passed to this transform
   */
  getTemplateObject() {
    return this.templateObject;
  }
};
