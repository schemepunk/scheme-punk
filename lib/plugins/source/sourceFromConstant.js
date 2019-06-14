'use strict';

/**
 * Function to source from a constant passed in via options.
 *
 * @param {*} superclass
 *  A destination superclass.
 * @return {Class}
 *  The result of a destination class.
 */
module.exports = superclass => class extends superclass {
  /**
     * Creates a source class.
     * @param {Object} options
     *   Options for the source.
     * @param {Object} options.constant
     *   A constant value you would like to pass on to the scheme.
     * @param {Object} scheme
     *   The scheme.
     * @param {Object} holdOvers
     *   Any holdovers.
     * @param {String} callPath
     *   A call path used as a base path for file operation sources
     *   like templates.
     * @returns {void}
     */
  async init(options, scheme, holdOvers, callPath = '') {
    await super.init(options, scheme, holdOvers, callPath);
    await this.setOrigin(this.options.constant); // The constant we are providing.
    return this;
  }

  /**
     * getSource gets the source for schemePunk.
     *
     * @return {Object} source
     *    Gets the target from the origin.
     */
  async getSource() {
    return this.getOrigin();
  }

  /**
     * Function to set the passed in value as our origin. In this case the constant
     *   from options.
     * @param {string} origin
     *  The scheme origin you would like to use.
     * @returns {void}
     */
  setOrigin(origin) {
    this.retrievedOrigin = origin;
    super.setOrigin(this.retrievedOrigin);
  }
};
