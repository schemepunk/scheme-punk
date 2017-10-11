'use strict';

/*
 *Config indicated plugins point to js scripts that load in plugins.
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

// Set our default super classes.

// Need to create a destination super.
const destSuper = class schemePunkDestinationSuper {};
// Need to create a source super.
const sourceSuper = class schemePunkSourceSuper {};
// Need to create a transform super.
const transformSuper = class schemePunkTransformSuper {};

module.exports = {
  schemePunk: {
    destination: {
      superOverride: destSuper
    },
    source: {
      superOverride: sourceSuper
    },
    transformation: {
      superOverride: transformSuper
    }
  }
};
