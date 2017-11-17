'use strict';

const _ = require('lodash');
/**
 * Destination plugins control how and where we write our transformed property.
 * Default case is to write to an object property in the scheme in play
 * and then to
 * push the scheme in play to the newScheme place.
 *
 * Another behavior would be to write to a file. <- this could be useful in
 *  situations where we are creating cached destination writing output.
 * Another behavior would be to use a destination token template to write
 * the transformed property into a tokenized template
 * essentially adding that shape if it doesn't exist to the scheme in play
 * and if it does exist adding the property to the nested location within.
 *
 * Lets get write to object property down
 * Then merge property
 * then aim for tokenized templates
 * then write to a file.
 *
 * We may need to bring in the schemePunk creation because maybe that's
 * actually some behavior of destination or that destination enhances that
 * in some way.
 */
module.exports = class destinationSuperBase {
  /**
   * Initialize the destination super class.
   *
   * @param {Object} options - An options object.
   * @param {*} transformedValue - A transformed target.
   * @param {Object} scheme - A destination scheme.
   * @param {Object} holdOvers - An object of holdovers.
   */
  init(options, transformedValue, scheme, holdOvers) {
    // eslint-disable-next-line no-unused-vars
    this.scheme = scheme;
    this.setTarget(options.target);
    this.setDestination(options.destinationValue);
    this.setValue(transformedValue);
    this.setHoldOvers(holdOvers);
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
};
