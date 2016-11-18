'use strict';

const path = require('path');
// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});
// set up test config dirs.
process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config', 'pluginConfigFour');
// And require here so that later requires will use this cached version.
const config = require('config'); // eslint-disable-line no-unused-vars
const schemePunkConfig = require('./../lib/schemePunkPluginLoader'); // eslint-disable-line no-unused-vars

const SchemePunkTransformBase = require('./../lib/transform/schemePunkTransformBase');
const SchemePunkSourceBase = require('./../lib//source/schemePunkSourceBase');
const SchemePunkDestinationBase = require('./../lib/destination/schemePunkDestinationBase');

const options = require('./helpers/schemePunkTestOptions');
const fs = require('fs-extra');

const bit = ['title', 'description', 'numberProperty'];
const schemePunkScheme = fs.readJSONSync('./test/helpers/schemePunkMockScheme.json');

// We now have subbed supers.

// We could create base items
// and then check them.

const SchemeSource = SchemePunkSourceBase(options.source);
const schemeSource = new SchemeSource(options.source, schemePunkScheme);
// Get the source.
// Create the transformation mixin assocatied with this transform key.
const SchemeTransformer = SchemePunkTransformBase(options.transform);
// Here is an instance of schemeTransformer.
const schemeTransform = new SchemeTransformer();

const destOptions = {
  target: 'links[0].schema.properties.fields.enum',
  plugin: 'destinationMixin'
};

// Get Scheme.
const SchemeDestination = SchemePunkDestinationBase(destOptions);
const schemeDestination = new SchemeDestination(destOptions, bit, schemePunkScheme);

module.exports = {
  // Test to see that a scheme punk item in the config with no plugins adds
  // no additional plugins.
  superSourceSub: (test) => {
    test.expect(1);
    test.deepEqual(
      typeof schemeSource.superMethod === 'function',
      true
    );
    test.done();
  },
  superTransformSub: (test) => {
    test.expect(1);
    test.deepEqual(
      typeof schemeTransform.superMethod === 'function',
      false
    );
    test.done();
  },
  superDestinationSub: (test) => {
    test.expect(1);
    test.deepEqual(
      typeof schemeDestination.superMethod === 'function',
      true
    );
    test.done();
  }
};
