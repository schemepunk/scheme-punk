'use strict';

// Using config module with this module's default config.
const sourceConfig = require('./../schemePunkPluginLoader');
const schemePunkSource = require('./schemePunkSource');

/**
 * Function returns a scheme Punk Source Base class with mixins (if plugin)
 * and the scheme punk source base class if no plugin.
 */
// eslint-disable-next-line no-unused-vars
module.exports = function source(options, scheme, holdOvers) {
  const tmpOptions = Object.assign({}, options);
  if (tmpOptions.plugin) {
    /**
     * We see that we need to return this class with a mixin capability.
     * This is a mixin approach described here:
     * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
     * This approach give us:
     * 1) Subclasses which can override mixin methods.
     * 2) a working super()
     * 3) Composition is preserved if all implementing methods call super.
     * Our transform config base is our plugin loader which grabs default and
     * overides.
     * It also implements key elements of the schemePunkTransform class.
     */
    return class schemePunkSourceBase extends sourceConfig.sourcePlugins[tmpOptions.plugin] {
      /**
       * Function to tranform a value, this is an implementing class and thus
       * calls super.transform() like a mixin.
       *
       * @param value
       *  A value to perform a transformation upon.
       */
       // Sets the origin. I.e. SchemePunkScheme, a file, a variable.
      setOrigin(value) {
        this.retrievedOrigin = value;
        // This will mostly be a pass through unless we have a file operation.
        super.setOrigin(value);
      }

      /**
       * setTarget - Sets the target within the source. Calls up to a super.
       *
       * @param
       *  targetValue
       */
      setTarget(targetValue) {
        this.schemePunkSourceTarget = targetValue;
        if (super.setTarget) super.setTarget(targetValue);
      }

      /**
       * setHoldovers - sets holdOvers on src. If we have a src key
       *   inside of setHolders, we attempt to retrieve those values
       *   from the source and assign them to the holdovers.
       *
       * @param  obj holdOvers
       *   An object of holdOver keys for use with transforms and destinations.
       *
      */
      setHoldOvers(holdOverValues) {
        this.holdOvers = holdOverValues;
        super.setHoldOvers(holdOverValues);
      }
    };
  }
  // Otherwise return schemePunkSourceBase.
  return class schemePunkSourceBase extends schemePunkSource {};
};
