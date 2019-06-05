'use strict';

const _ = require('lodash');

/**
 * SchemePunkSource class.
 */
module.exports = class sourceSuperBase {
  /**
   * init function for schemePunkSource.
   *
   * @param  obj options
   *   An options object to configure our source class.
   * @param  obj scheme
   *   A scheme punk scheme.
   * @param obj holdOvers
   *  Holdover values set in source that carry through to destination.
   * @param {string} callPath
   *  A callPath to use as a prefix with any path based origins.
   * @returns sourceSuperBase
   *  Returns and instance of the sourceSuperBase.
   */
  async init(options, scheme, holdOvers, callPath = '', templateObject = false) {
    this.scheme = scheme;
    this.setCallPath(callPath);
    this.setOrigin(options.origin);
    this.setTarget(options.target);
    this.setHoldOvers(holdOvers);
    this.setTemplateObject(templateObject);
    await this.getOrigin();
    return this;
  }

  /**
   * setOrigin Sets the retrieved origin property.
   *
   * @param  originValue
   *   The origin value which could be an object or other.
   *
   */
  setOrigin(originValue) {
    this.retrievedOrigin = originValue;
  }

  /**
   * getOrigin - returns the retrieved origin from schemePunkSource.
   *
   * @return {Promise|*} this.retrievedOrigin.
   *   A promised bearing origin.
   */
  async getOrigin() {
    return this.retrievedOrigin;
  }

  /**
   * setTarget - sets the target we will use against the origin to get our
   * source.
   *
   * @param {*} targetValue
   *   A target to use to find the value for our source.
   *
   */
  setTarget(targetValue) {
    this.schemePunkSourceTarget = targetValue;
  }

  /**
   * getSchemePunkSourceTarget returns the target of our origin containing
   * our desired source.
   *
   * @return this.schemePunkSourceTarget;
   */
  async getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }

  /**
   * getSource gets the source for schemePunk based on our origin and target.
   *
   * @return source
   *    Gets the target from the origin.
   */
  async getSource() {
    const origin = await this.getOrigin();
    const target = await this.getSchemePunkSourceTarget();
    return _.get(origin, target);
  }

  /**
   * setHoldovers - sets holdOvers on src. If we have a src key
   *   inside of setHolders, we attempt to set the properties from the source.
   *
   * @param  obj holdOvers
   *   An object of holdOver keys for use with transforms and destinations.
   *
   */
  async setHoldOvers(holdOvers) {
    const newSrc = {};
    const tmpHoldOvers = {};
    const resolvedHoldOvers = await holdOvers;
    if (!Object.keys(resolvedHoldOvers).length) {
      this.holdOvers = newSrc;
    }
    else {
      if (!_.has(resolvedHoldOvers, 'src')) { // eslint-disable-line no-lonely-if
        this.holdOvers = Object.assign({}, resolvedHoldOvers);
      }
      else {
        const origin = await this.getOrigin();

        for (let i = 0; i < Object.keys(resolvedHoldOvers.src).length; i += 1) {
          tmpHoldOvers[Object.keys(resolvedHoldOvers.src)[i]] = _.get(
            origin,
            resolvedHoldOvers.src[Object.keys(resolvedHoldOvers.src)[i]],
            ''
          );
        }
        const slSrc = Object.assign({}, tmpHoldOvers);

        this.holdOvers = _.merge(resolvedHoldOvers, slSrc);
      }
    }
  }

  /**
   * getHoldOvers gets the holdOvers for schemePunk source which may include
   *   values set from the source.
   *
   * @return obj holdOvers
   *    Gets the holdOvers object.
   */
  async getHoldOvers() {
    return this.holdOvers;
  }

  /**
   * Sets the call path for the source super.
   *
   * @param {string} callPath
   *   A path to use as a prefix in any config passed paths.
   */
  setCallPath(callPath) {
    this.callPath = callPath;
  }

  /**
   * Gets the call path for the source super.
   *
   *
   * @returns {string} callPath
   */
  getCallPath() {
    return this.callPath;
  }

  /**
   * Sets the template object for this source.
   *
   * @param {Object} templateObject
   *   A template object object.
   */
  setTemplateObject(templateObject) {
    this.templateObject = templateObject;
  }

  /**
   * Gets the template object for this source.
   *
   * @returns {Object}
   *   Returns the template object passed to this source.
   */
  getTemplateObject() {
    return this.templateObject;
  }
};
