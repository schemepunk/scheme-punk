'use strict';


// Using config module with this module's default config.
const destinationConfig = require('./../schemePunkPluginLoader');
const schemePunkDestinatino = require('./schemePunkDestination');

module.exports = function destination(configs, options) {
  if (options.plugin) {
    // return a class with a mixin.
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
    return class schemePunkDestinationBase extends destinationConfig.destinationPlugins[options.plugin] {
      /**
       * Here for mixins.
       */
      setDestination(destinationValue) {
        // Set destination value.
        super.setDestination(destinationValue);
      }

      /**
       * Here for mixins.
       */
      writeDestinationTarget() {
        super.writeDestinationTarget();
      }
    };
  }
  // Otherwise return the base class.
  return class schemePunkDestinationBase extends schemePunkDestination {};
};
