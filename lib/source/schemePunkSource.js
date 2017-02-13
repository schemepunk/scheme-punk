'use strict';

const _ = require('lodash');
// We can have complete schemas as sources
// We can have portions of a schema as a source
// We can have complete template files as sources
// We can have portions of files as sources
// We can have variables as sources.

// We have origins and targets within the source

// Have a source type - object, file, a passed variable.
// have a source  - could be a file or a variable name
// have a source target - '' == full, 'string' == target within an object

/**
 * SchemePunkSource class.
 */
module.exports = class schemePunkSource {

 /**
  * Constructor function for schemePunkSource.
  *
  * @param  obj options
  *   An options object to configure our source class.
  * @param  obj scheme
  *   A scheme punk scheme.
  *
  */
  constructor(options, scheme, holdOvers) {
    // eslint-disable-next-line no-unused-vars
    this.scheme = scheme;
    this.setOrigin(options.origin);
    this.setTarget(options.target);
    this.setHoldOvers(holdOvers);
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
   * @return this.retrievedOrigin
   *   This is the origin that we will apply a target to for our source.
   */
  getOrigin() {
    return this.retrievedOrigin;
  }

  /**
   * setTarget - sets the target we will use against the origin to get our
   * source.
   *
   * @param  targetValue
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
  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }

  /**
   * getSource gets the source for schemePunk based on our origin and target.
   *
   * @return source
   *    Gets the target from the origin.
   */
  getSource() {
    return _.get(this.getOrigin(), this.getSchemePunkSourceTarget());
  }

  /**
   * setHoldovers - sets holdOvers on src. If we have a src key
   *   inside of setHolders, we attempt to set the properties from the source.
   *
   * @param  obj holdOvers
   *   An object of holdOver keys for use with transforms and destinations.
   *
   */
  setHoldOvers(holdOvers) {
    // check for 'src' key in holdOvers
    if (Object.keys(holdOvers).length) {
      let newSrc = {};
      if (_.has(holdOvers, 'src')) {
        for (let i = 0; i < Object.keys(holdOvers.src).length; i += 1) {
          holdOvers.src[Object.keys(holdOvers.src)[i]] = _.get(this.getOrigin(), holdOvers.src[Object.keys(holdOvers.src)[i]], '');
        }
        newSrc = Object.assign({}, holdOvers.src);
        _.unset(holdOvers, 'src');
      }
      // If we have one then we need to set some items here.
      this.holdOvers = Object.assign(holdOvers, newSrc);
    }
    else {
      this.holdOvers = {};
    }
  }

  /**
   * getHoldOvers gets the holdOvers for schemePunk source which may include
   *   values set from the source.
   *
   * @return obj holdOvers
   *    Gets the holdOvers object.
   */
  getHoldOvers() {
    return this.holdOvers;
  }
};
