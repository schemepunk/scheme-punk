'use strict';

// require the directory with all of your supers classes.
// THe directory will be organized with directories representing
// super name spaces
// and those directories will hold your supers classes.
//  supersDirectory
//  |-- exampleSuperNameSpace.js
const supers = require('./supers');

// require the directory with all of your mixins.
// THe directory will be organized with directories representing
// super name spaces
// and those directories will hold your mixins
//  plugins
//  |-- exampleSupersNameSpace
//  |-- | -- mixinOne.js
//  |-- | -- mixinTwo.js
const plugins = require('./plugins');

// set the path to your .molotov.json molotov config file
// (see above) from your
// modules root.
const molotovPath = './';

// Require the molotov file from the molotov module.
// You will be extending this class.
const Molotov = require('molotov/molotov');

const molotovNameSpace = 'schemePunk';

// By extending the molotov class you use the common molotov
// interface and provide your super and requires at require time.
// ensuring require caching.

// Also, by extending the molotov class and indicating the path
// in your .molotov.json file you allow other module writers
// to use or extend your plugins with their cocktail classes.

const SchemePunkMolotov = class extends Molotov {
  constructor(configs, dynamicPlugs) {
    super(molotovPath, molotovNameSpace, supers, plugins, dynamicPlugs);
    this.configs = configs;
  }
};

/**
 * SchemePunkMolotov Factory.
 * @param {Object} molotovConfig
 *   Options for the schemePunkMolotov.
 * @param {Object} options.config
 *   Pass in a configuration object from a schemePunk implementing module for
 *   cocktail overrides.
 * @param {Object} options.dynamicPlugs
 *   Pass in dynamic plugin creations.
 */
module.exports = function schemePunkMolotov(molotovConfig = {config: {}, dynamicPlugins: {}}) {
  return new SchemePunkMolotov(molotovConfig.config, molotovConfig.dynamicPlugins);
};
