'use strict';

// Using config module with this module's default config.
const requireDirectory = require('require-directory');

// require the directory with all of your supers classes.
// THe directory will be organized with directories representing
// super name spaces
// and those directories will hold your supers classes.
//  supersDirectory
//  |-- exampleSuperNameSpace.js
const supers = requireDirectory(module, './lib');

// require the directory with all of your mixins.
// THe directory will be organized with directories representing
// super name spaces
// and those directories will hold your mixins
//  plugins
//  |-- exampleSupersNameSpace
//  |-- | -- mixinOne.js
//  |-- | -- mixinTwo.js
const plugins = requireDirectory(module, './lib/plugins');

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

module.exports = class extends Molotov {
  constructor() {
    super(molotovPath, molotovNameSpace, supers, plugins);
  }
};
