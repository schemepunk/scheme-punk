'use strict';


const molotovConfig = require('./molotov.json');
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
const mixins = require('./plugins');


// Require the molotov file from the molotov module.
// You will be extending this class.
const Molotov = require('molotov/lib/molotov');

const molotovNameSpace = 'schemePunk';

// By extending the molotov class you use the common molotov
// interface and provide your super and requires at require time.
// ensuring require caching.

// Also, by extending the molotov class and indicating the path
// in your .molotov.json file you allow other module writers
// to use or extend your plugins with their cocktail classes.

const SchemePunkMolotov = class extends Molotov {
  constructor(overrides, cocktailClasses) {
    super(molotovConfig, molotovNameSpace, supers, mixins, overrides, cocktailClasses);
  }
};

/**
 * SchemePunkMolotov Factory.
 * @param {Object} configObject
 *   Options for the schemePunkMolotov.
 * @param {Object} configObject.config
 *   Any dynamic molotov configuration to pass along.
 * @param {Array} configObject.cocktailClasses
 *   An array of cocktail classes that modules implementing schemePunk may
 *   use to override plugins and supers.
 */
module.exports = function schemePunkMolotov(configObject = {overrides: {}, cocktailClasses: []}) {
  return new SchemePunkMolotov(configObject.overrides, configObject.cocktailClasses);
};
