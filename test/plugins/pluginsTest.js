'use strict';

/*
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
 */
// Define a new mixin
const superConfig = require('./../../lib/schemePunkSupers');

const newSourceMixin = superclass => class extends superclass {
  setOrigin() {
    this.retrievedOrigin = {
      test: 'test'
    };
  }
};

const newTransformMixin = superclass => class extends superclass { /**
   * Function to tranform an object to an array of keys.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  transform() {
    // Set this.value to the keys of the object passed.
    this.value = 'testValue';
    // Call super.transform and pass along the new value to honor composition.
    if (super.transform) super.transform(this.value);
  }
};

const newDestinationMixin = superclass => class extends superclass {
  setDestination() {
    // use destinationTemplates if provided.
    // Set destination value.
    this.destination = 'newScheme';
  }
};

module.exports = {
  destinationPlugins: {
    destinationMixin: newDestinationMixin(superConfig.destination)
  },
  sourcePlugins: {
    sourceMixin: newSourceMixin(superConfig.source)
  },
  transformPlugins: {
    transformMixin: newTransformMixin(superConfig.transform)
  }
};
