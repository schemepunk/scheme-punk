'use strict';

// Using config module with this module's default config.
const transformConfig = require('./../schemePunkPluginLoader');
const schemePunkTransform = require('./schemePunkTransform');

/**
 * SchemePunkTransformBase function returns a class object that when supplied
 * with a plugin returns a mixin class or without a plugin a base class.
 *
 * @param  obj options
 *  An options object with a key name in options.plugin.
 * @return object
 *   A schemePunkTransformBase class.
 */
module.exports = function transform(options, holdOvers) {
  let schemeOptions = {};
  if (options) {
    schemeOptions = options;
  }

  if (schemeOptions.plugin) {
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
      constructor() {
        super(schemeOptions, holdOvers);
      }
      /**
       * Function to tranform a value, this is an implementing class and thus
       * calls super.transform() like a mixin.
       *
       * @param value
       *  A value to perform a transformation upon.
       */
      transform(value) {
        return Promise.resolve()
          .then(() => super.transform(value))
          .then((transformedValue) => {
            this.value = transformedValue;
          });
      }
    };
  }

  // Return Base class only.
  return class schemePunkTransformBase extends schemePunkTransform {
    constructor() {
      super(schemeOptions, holdOvers);
    }
    transform(value) {
      return Promise.resolve()
        .then(() => super.transform(value))
        .then((transformedValue) => {
          this.value = transformedValue;
        });
    }
  };
};
