'use strict';

const path = require('path');

// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config', 'pluginConfigThree');

const config = require('config'); // eslint-disable-line no-unused-vars
const schemePunkConfig = require('../lib/schemePunkPluginLoader');
const SchemePunkSourceBase = require('../lib/source/schemePunkSourceBase');
const schemePunkDestinationBase = require('../lib/destination/schemePunkDestinationBase');

const fs = require('fs-extra');

const options = {
  source: {
    target: 'properties.data.properties.attributes.properties',
    plugin: 'sourceMixin'
  }
};

const destOptions = {
  target: 'title.description',
  plugin: 'destinationMixin'
};

module.exports = {
  pluginsMerge: (test) => {
    test.expect(3);
    // Load plugins from valid config where we have two plugin files.
    // We expect that if plugins are redeclared that they will overwite
    // in an expected way.  Let's first test that the two plugin files
    // are merged together.
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
      9
    );
    test.done();
  },
  testPluginOverwriteOrder: (test) => {
    test.expect(1);
    const schemePart = fs.readJSONSync('./test/helpers/sourceSchema.json');
    // Create a new schemePunk factory.
    const SchemeSource = SchemePunkSourceBase(options.source);
    const schemeSource = new SchemeSource(options.source, schemePart, {});
    test.deepEqual(
      schemeSource.getOrigin(),
      {test: 'test2'}
    );
    test.done();
  },
  testDestinationTargetWriter: (test) => {
    const schemePart = fs.readJSONSync('./test/helpers/sourceSchemaItem.json');
    const SchemeDestination = schemePunkDestinationBase(destOptions);
    const schemeDestination = new SchemeDestination(destOptions, 'testing dest', schemePart, {});
    schemeDestination.writeDestinationTarget();
    test.deepEqual(
      schemeDestination.scheme.newScheme.title.description,
      'testing dest'
    );
    test.done();
  }
};
