'use strict';

const path = require('path');
// Need to get clean versions to test with env variables.
delete require.cache[require.resolve('../lib/schemePunkPluginLoader')];
delete require.cache[require.resolve('config')];
// set up test config dirs.
process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config', 'pluginConfigOne');
// And require here so that later requires will use this cached version.
const config = require('config'); // eslint-disable-line no-unused-vars
const schemePunkConfig = require('./../lib/schemePunkPluginLoader');

module.exports = {
  // Test to see that a scheme punk item in the config with no plugins adds
  // no additional plugins.
  pluginHasSchemePunkNoPlugins: (test) => {
    test.expect(3);
    // Test for default plugins.
    test.deepEqual(
      Object.keys(schemePunkConfig.destinationPlugins),
      []
    );
    test.deepEqual(
      Object.keys(schemePunkConfig.sourcePlugins).length,
      1
    );
    test.deepEqual(
      Object.keys(schemePunkConfig.transformPlugins).length,
      1
    );
    delete require.cache[require.resolve('../lib/schemePunkPluginLoader')];
    delete require.cache[require.resolve('config')];
    process.env.NODE_CONFIG_DIR = path.join('');
    test.done();
  }
};