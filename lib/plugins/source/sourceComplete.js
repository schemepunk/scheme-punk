'use strict';

const _ = require('lodash');

/**
   * Function to source a full item.
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
 * @param {Object} options.origin
 *   An object keyed by possible values of the target or defined/undefined
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
    const tmpOrigin = _.get(options, 'origin', 'originalScheme');
    await this.setOrigin(tmpOrigin); // The full original scheme
    return this;
  }

  /**
   * getSource gets the source for schemePunk based on our origin and target.
   *
   * @return {Object} source
   *    Gets the target from the origin.
   */
  async getSource() {
    return this.getOrigin();
  }

  /**
   * Function to set orignal scheme as the origin.
   * @param {string} origin
   *  The scheme origin you would like to use.
   * @returns {void}
   */
  setOrigin(origin) {
    this.retrievedOrigin = this.scheme[origin];
    super.setOrigin(this.retrievedOrigin);
  }
};
