'use strict';

module.exports = class schemePunkDestinationSuper {
  constructor(options, transformedValue, scheme) {
    // eslint-disable-next-line no-unused-vars
    this.scheme = scheme;
    this.setTarget(options.target);
    this.setDestination(options.destinationValue);
    this.setValue(transformedValue);
  }

  superMethod() {
    this.testPower = true;
    return this.testPower;
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
   * Check to see if the target exists in the destination.
   */
  validateDestinationTarget() {
    if ({}.hasOwnProperty.call(this.scheme[this.getDestination()], this.getTarget())) {
      return true;
    }
    return false;
  }

  /**
   * Establish the destination target. Could create the property or utilize
   * a template to create the property if it doesn't exist.
   */
  createDestinationTarget() {
    this.scheme[this.getDestination()][this.getTarget()] = null;
  }

  /**
   * Gets the scheme from the destination.
   * @return scheme
   *  This.scheme.
   */
  getScheme() {
    return this.scheme;
  }
};
