'use strict';

// Using config module with this module's default config.
const sourceConfig = require('./../schemePunkPluginLoader');
const schemePunkSource = require('./schemePunkSource');

// eslint-disable-next-line no-unused-vars
module.exports = function source(options, scheme) {
  if (!options) options = {};
  if (options.plugin) {
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
    return class schemePunkSourceBase extends sourceConfig.sourcePlugins[options.plugin] {
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

      setTarget(targetValue) {
        this.schemePunkSourceTarget = targetValue;
        if (super.setTarget) super.setTarget(targetValue);
      }
    };
  }
  // Otherwise return schemePunkSourceBase.
  return class schemePunkSourceBase extends schemePunkSource {};
};
