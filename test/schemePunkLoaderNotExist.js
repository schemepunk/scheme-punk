'use strict';

const path = require('path');

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config', 'pluginConfigTwo');

const config = require('config'); // eslint-disable-line no-unused-vars
const schemePunkConfig = require('../lib/schemePunkPluginLoader');

module.exports = {
  pluginsIndicatedButDoNotExist: (test) => {
    test.expect(3);
    // Test for default plugins.
    test.deepEqual(
      Object.keys(schemePunkConfig.destinationPlugins).length,
      5
    );
    test.deepEqual(
      Object.keys(schemePunkConfig.sourcePlugins).length,
      4
    );
    test.deepEqual(
      Object.keys(schemePunkConfig.transformPlugins).length,
      10
    );
    delete require.cache[require.resolve('../lib/schemePunkPluginLoader')];
    delete require.cache[require.resolve('config')];
    process.env.NODE_CONFIG_DIR = path.join('');
    // Clean up.
    test.done();
  }
};
