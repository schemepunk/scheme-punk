'use strict';

const path = require('path');

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

const schemePunkConfig = require('./../lib/schemePunkPluginLoader');

module.exports = {
  pluginDefaults: (test) => {
    test.expect(3);
    // Test for default plugins.
    test.deepEqual(
      Object.keys(schemePunkConfig.destinationPlugins).length,
      4
    );
    test.deepEqual(
      Object.keys(schemePunkConfig.sourcePlugins).length,
      3
    );
    test.deepEqual(
      Object.keys(schemePunkConfig.transformPlugins).length,
      9
    );
    // Alter Node defaults for testing.
    delete require.cache[require.resolve('../lib/schemePunkPluginLoader')];
    delete require.cache[require.resolve('config')];
    process.env.NODE_CONFIG_DIR = path.join('');
    test.done();
  }
  // Final test
  // delete require.cache[require.resolve('../lib/configPropertyStamp.js')];
  // delete require.cache[require.resolve('config')];
};
