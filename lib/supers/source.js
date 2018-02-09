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
   * @returns sourceSuperBase
   *  Returns and instance of the sourceSuperBase.
   */
  init(options, scheme, holdOvers) {
    this.scheme = scheme;
    this.setOrigin(options.origin);
    this.setTarget(options.target);
    this.setHoldOvers(holdOvers);
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
  getOrigin() {
    return Promise.resolve(this.retrievedOrigin);
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
  getSchemePunkSourceTarget() {
    return Promise.resolve(this.schemePunkSourceTarget);
  }

  /**
   * getSource gets the source for schemePunk based on our origin and target.
   *
   * @return source
   *    Gets the target from the origin.
   */
  getSource() {
    return Promise.all([this.getOrigin(), this.getSchemePunkSourceTarget()])
      .then(([origin, target]) => _.get(origin, target));
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
    const tmpHoldOvers = {};
    const holdOverTests = [
      {
        test: !Object.keys(holdOvers).length,
        holdOverPromise: Promise.resolve({}),
      },
      {
        test: !_.has(holdOvers, 'src'),
        holdOverPromise: Promise.resolve(Object.assign({}, holdOvers)),
      },
      {
        test: true,
        holdOverPromise: this.getOrigin()
          .then((origin) => {
            for (let i = 0; i < Object.keys(holdOvers.src).length; i += 1) {
              tmpHoldOvers[Object.keys(holdOvers.src)[i]] = _.get(
                origin,
                holdOvers.src[Object.keys(holdOvers.src)[i]],
                ''
              );
            }
            return tmpHoldOvers;
          })
          .then(slSrc => Object.assign({}, slSrc))
          .then(src => Object.assign(holdOvers, src))
      }
    ];
    // Check the tests for the first passing condition and set holdovers
    // to this promise.
    this.holdOvers = _.find(holdOverTests, hot => hot.test).holdOverPromise;
  }

  /**
   * getHoldOvers gets the holdOvers for schemePunk source which may include
   *   values set from the source.
   *
   * @return obj holdOvers
   *    Gets the holdOvers object.
   */
  getHoldOvers() {
    return Promise.resolve(this.holdOvers);
  }
};
