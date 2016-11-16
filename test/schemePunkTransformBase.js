'use strict';

const SchemePunkTransformBase = require('../lib/transform/schemePunkTransformBase');
const options = require('./helpers/schemePunkTestOptions');
const fs = require('fs-extra');

const schemePunkScheme = fs.readJSONSync('./test/helpers/schemePunkMockScheme.json');

// Create the transformation mixin assocatied with this transform key.
const SchemeTransformer = SchemePunkTransformBase(options.transform);
const SchemeTransformerNoPlugs = SchemePunkTransformBase();
// Here is an instance of schemeTransformer.
const atransformer = new SchemeTransformer();
const btransformer = new SchemeTransformerNoPlugs();
// Run the transformer

// test writeDestinationTarget - did it get the items

// promote - did it get active

// test get the scheme

module.exports = {
  classConstruction: (test) => {
    test.expect(1);
    test.deepEqual(
      atransformer.constructor.name,
      'schemePunkTransformBase'
    );
    test.done();
  },
  classConstructionNoPlugin: (test) => {
    // Test that it is a desination.
    // Test that it is not destination base
    test.deepEqual(
      btransformer.constructor.name,
      'schemePunkTransformBase'
    );
    test.done();
  },
  testBaseTransform: (test) => {
    test.expect(1);
    btransformer.transform(schemePunkScheme);
    test.deepEqual(
      btransformer.value,
      schemePunkScheme
    );
    test.done();
  },
  testBaseTransformSuperCall: (test) => {
    test.expect(1);
    atransformer.transform(schemePunkScheme.properties.data.properties.attributes.properties);
    test.deepEqual(
      atransformer.value,
      ['title', 'description', 'numberProperty']
    );
    test.done();
  }
};
