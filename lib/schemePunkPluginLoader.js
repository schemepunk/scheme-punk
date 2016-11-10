'use strict';

/**
 * This plugin loader attempts to merge in configuration entities for
 * schemePunk tranformations, sources, and destinations if they exist in
 * a npm module config compatible configuration. It then attempts to merge
 * those overrides over default configuration for this module and its plugins.
 *
 * This happens in require time. It also sets up the pattern that any
 * configuration override behavior will belong in the application
 * config space rather than other modules. If additional plugin supplying
 * modules are to be included that will need to happen in the app config.
 */

// Prevent config warnings if this module is the only use of config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
// Use require directory to require all of our default plugins.
const requireDirectory = require('require-directory');
const config = require('config');
const tryRequire = require('try-require');

const tempPlugins = [];
// Bring in our default transform, source, and destinaiton plugins.
const defaultPluginRequireDirectory = requireDirectory(module, './plugins');
const schemePunkTransformSuperDefault = require('./transform/schemePunkTransform');
// const schemePunkSourceSuperDefault = require('./source/schemePunkSource');
// const schemePunkDestinationSuperDefault = require('./source/schemePunkDestination');

// Set our default super classes.
let transformSuper = schemePunkTransformSuperDefault;
// let sourceSuper = schemePunkSourceSuperDefault;
// let destinationSuper = schemePunkDestinationSuper;

let configPlugins = {};

// Check for config overrides for schemePunk.
if (config.has('schemePunk')) {
  // Do we have schemePunk Plugin overrides in config?
  if (config.has('schemePunk.plugins')) {
    // Attempt to require plugins from config.

    for (let p = 0; p < config.schemePunk.plugins; p += 1) {
      if (tryRequire.resolve(config.schemePunk.plugins[p])) {
        // No way around requiring an expression this time.
        // eslint-disable-next-line import/no-dynamic-require
        tempPlugins.push(require(config.schemePunk.plugins[p]));
      }
    }
    // Merge in the plugins with a last in override approach.
    configPlugins = Object.assign(...tempPlugins);
  }
  // Is there an override to the schemePunkTransformSuper in config?
  if (config.has('schemePunk.transform.schemePunkTransformSuperOverride')) {
    const override = config.get('schemePunk.transform.schemePunkTransformSuperOverride');
    // No way around requiring an expression this time.
    // eslint-disable-next-line import/no-dynamic-require
    transformSuper = tryRequire.resolve() ? require(override) : transformSuper;
  }
}

/**
 * This is going to be our default Scheme Punk plugins mixin object holder.
 * This will allow us to create extends signatures for dynamic inclusion based
 * on config. Additional plugins can be added by adding paths to your custom
 * or other module's plugin loaders which will supply an object like below.
 *
 * Through require directory plugins are located at :
 * defaultPlugins["pluginFolder"]["FILENAME"].
 * Each of the mixin extends signatures need to pass in the superclass.
 * for example:
 * defaultPluginRequireDirectory["pluginFolder"]["FILENAME"](SUPERCLASS)
 */
let schemePunkPlugins = {
  destinationPlugins: {
    // "exampleDestination": defaultPluginRequireDirectory["destination"]["destinationFileName"](destinationSuper)
  },
  sourcePlugins: {
    // "exampleSource": defaultPluginRequireDirectory["source"]["sourceFileName"](sourceSuper)
  },
  transformPlugins: {
    objectKeysTransform: defaultPluginRequireDirectory.transform.objectKeysTransform(transformSuper)
  }
};

// If we have overrides of our transform plugins in config we will combine
// them with default transform plugins.
if (Object.getOwnPropertyNames(configPlugins).length > 0) {
  schemePunkPlugins = Object.assign(schemePunkPlugins, configPlugins);
}

module.exports = schemePunkPlugins;
