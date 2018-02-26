'use strict';

const _ = require('lodash');
/**
 * Destination plugins control how and where we write our transformed property.
 * Default case is to write to an object property in the scheme in play
 * and then to push the scheme in play to the newScheme place.
 *
 */
module.exports = class destinationSuperBase {
  /**
   * Initialize the destination super class.
   *
   * @param {Object} options - An options object.
   * @param {*} transformedValue - A transformed target.
   * @param {Object} scheme - A destination scheme.
   * @param {Object} holdOvers - An object of holdovers.
   * @param {string} callPath - The path prefix you would like schemePunk to use
   *   when working with any schemes that have path origins or parameters.
   */
  init(options, transformedValue, scheme, holdOvers, callPath = '') {
    // eslint-disable-next-line no-unused-vars
    this.scheme = scheme;
    this.setTarget(options.target);
    this.setDestination(options.destinationValue);
    this.setValue(transformedValue);
    this.setHoldOvers(holdOvers);
    this.setCallPath(callPath);
    return Promise.resolve(this);
  }

  /**
   * Sets newScheme to the active Scheme.
   */
  promoteActiveToNewScheme() {
    this.scheme.newScheme = this.scheme.activeScheme;
  }

  /**
   * Set a target for the writer. The base is to have this be a property.
   * @param targetValue
   *  The target property.
   */
  setTarget(targetValue) {
    this.target = targetValue;
  }

  /**
   * Retrieve a target for the writer.
   * @return target
   *  Target value.
   */
  getTarget() {
    return this.target;
  }

  /**
   * Set a destination. This is ripe for mixins.
   */
  setDestination() {
    // use destinationTemplates if provided.
    // Set destination value.
    this.destination = 'activeScheme';
  }

  /**
   * Set the transformed value.
   * @param value
   *  The Transformed value.
   */
  setValue(value) {
    this.value = value;
  }

  /**
   * @return this.value.
   *  Returns the transformed value.
   */
  getValue() {
    return this.value;
  }

  /**
   * Retrieve the destination target, a key in the scheme.
   * @return this.destination string.
   *  Returns a key for scheme.
   */
  getDestination() {
    return this.destination;
  }

  /**
   * validateDestinationTarget - checks to see if the target exists.
   *
   * @return boolean
   */
  validateDestinationTarget() {
    return _.has(this.scheme[this.getDestination()], this.getTarget());
  }

  /**
   * Write the transformed value to the target.
   *
   * Basic process writes a property (target) to the destination object.
   * Mixins will need to setValue to the destination.target value unless
   * they want super to overwrite.
   *
   */
  writeDestinationTarget() {
    // Check to see if destination does not yet exist.
    return Promise.resolve(_.set(
      this.scheme[this.getDestination()],
      this.getTarget(),
      this.getValue()
    ));
  }

  /**
   * Gets the scheme from the destination.
   * @return scheme
   *  This.scheme.
   */
  getScheme() {
    return this.scheme;
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

  /**
   * Sets the call path for the destination super.
   *
   * @param {string} callPath
   *   A path to use as a prefix in any config passed paths.
   */
  setCallPath(callPath) {
    this.callPath = callPath;
  }
  /**
   * Gets the call path for the destination super.
   *
   *
   * @returns {string} callPath
   */
  getCallPath() {
    return this.callPath;
  }
};
