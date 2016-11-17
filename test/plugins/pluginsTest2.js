'use strict';

/**
 * Config indicated plugins point to js scripts that load in plugins.
 * These can have varied implementations but must return an object that has
 * keys for destination, transform and source plugins. Each
 * like:
 * {
 *   destinationPlugins: {
 *     destinationPluginName: yourDestMixinName(superClass)
 *     destinationPluginNameOne: yourDestMixinName1(superClass)
 *     destinationPluginNameN: yourDestMixinName2(superClass)
 *   },
 *   sourcePlugins: {
 *     sourcePluginName: yourSourceMixinName(superClass)
 *     sourcePluginNameOne: yourSourceMixinName1(superClass)
 *     sourcePluginNameN: yourSourceMixinName2(superClass)
 *   },
 *   transformPlugins: {
 *     transformPluginName: yourSourceMixinName(superClass)
 *     transformPluginNameOne: yourSourceMixinName1(superClass)
 *     transformPluginNameN: yourSourceMixinName2(superClass)
 *   }
 * };
 **/
// Define a new mixin
const schemePunkTransformSuperDefault = require('./../../lib/transform/schemePunkTransform');
const schemePunkSourceSuperDefault = require('./../../lib/source/schemePunkSource');
const schemePunkDestinationSuperDefault = require('./../../lib/destination/schemePunkDestination');
// Set our default super classes.
const superConfig = {
  transform: schemePunkTransformSuperDefault,
  source: schemePunkSourceSuperDefault,
  destination: schemePunkDestinationSuperDefault
};

const newSourceMixin = superclass => class extends superclass {
  setOrigin() {
    this.retrievedOrigin = {
      test: 'test2'
    };
  }
};

const otherTransformMixin = superclass => class extends superclass { /**
   * Function to tranform an object to an array of keys.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  transform() {
    // Set this.value to the keys of the object passed.
    this.value = 'another test value';
    // Call super.transform and pass along the new value to honor composition.
    if (super.transform) super.transform(this.value);
  }
};

module.exports = {
  sourcePlugins: {
    sourceMixin: newSourceMixin(superConfig.source)
  },
  transformPlugins: {
    otherTransformMixin: otherTransformMixin(superConfig.transform)
  }
};
