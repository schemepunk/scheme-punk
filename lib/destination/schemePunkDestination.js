'use strict';

const _ = require('lodash');
/**
 * Destination plugins control how and where we write our transformed property.
 * Default case is to write to an object property in the scheme in play and then to
 * push the scheme in play to the newScheme place.
 *
 * Another behavior would be to write to a file. <- this could be useful in situations where we
 * are creating cached destination writing output.
 * Another behavior would be to write the transformed property into a tokenized template
 * essentially adding that shape if it doesn't exist to the scheme in play and if it does
 * exist adding the property to the nested location within.
 *
 * Lets get object property down
 * then aim for tokenized templates
 * then write to a file.
 *
 * We may need to bring in the schemePunk creation because maybe that's actually some behavior of destination or that destination enhances that in some way.
 */
module.exports = class schemePunkDestination {
  constructor(options, transformedValue, scheme) {
    // eslint-disable-next-line no-unused-vars
    this.scheme = scheme;
    this.setTarget(options.target);
    this.setDestination(options.destinationValue);
    this.setValue(transformedValue);
  }

  /**
   * Sets newScheme to the active Scheme.
   */
  promoteActiveToNewScheme() {
    this.scheme.newScheme = this.scheme.activeScheme;
  }
  /**
   * Set a target for the writer. The base is to have this be a property.
   *
   */
  setTarget(targetValue) {
    this.target = targetValue;
  }
  /**
   * Retrieve a target for the writer.
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
   *
   */
  setValue(value) {
    this.value = value;
  }

  /**
   *
   */
  getValue() {
    return this.value;
  }

  /**
   * Retrieve a destination object.
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
    this.scheme[this.getDestination()].target = null;
  }

  /**
   * Write the transformed value to the target.
   * Basic process writes a property (target) to the destination object.
   * Mixins will need to setValue to the destination.target value unless
   * they want super to overwrite.
   */
  writeDestinationTarget() {
    // Check to see if destination does not yet exist.
    if (!this.validateDestinationTarget()) {
      // It does not. Let us create it.
      this.createDestinationTarget();
    }
    _.set(this.scheme[this.getDestination()], this.getTarget(), this.getValue());
  }

  getScheme() {
    return this.scheme;
  }
};
