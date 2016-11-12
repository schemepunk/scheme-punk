'use strict';

// Using config module with this module's default config.
const transformConfig = require('./../schemePunkPluginLoader');

module.exports = function transform(configs, options) {
  // [ ] TODO: Figure out how to return a not extended version of this class.

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
  return class schemePunkTransformBase extends transformConfig.transformPlugins[options.plugin] {
    /**
     * Function to tranform a value, this is an implementing class and thus
     * calls super.transform() like a mixin.
     *
     * @param value
     *  A value to perform a transformation upon.
     */
    transform(value) {
      super.transform(value);
    }
  };
};
