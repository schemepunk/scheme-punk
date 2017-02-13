'use strict';

const SchemePunkSourceBase = require('../lib/source/schemePunkSourceBase');
const options = require('./helpers/schemePunkTestOptions');
const fs = require('fs-extra');

const schemePunkScheme = fs.readJSONSync('./test/helpers/schemePunkMockScheme.json');
const scheme = {
  originalScheme: schemePunkScheme
};

const schemePart = fs.readJSONSync('./test/helpers/sourceSchema.json');

// Create a new schemePunk factory.
const SchemeSource = SchemePunkSourceBase(options.source);
const SchemeSourceNoPlugs = SchemePunkSourceBase();

const schemeSource = new SchemeSource(options.source, scheme, {});
// Get the sourcen

const optionsNoPlugs = {
  source: {
    target: 'properties',
    origin: {
      properties: ['test1', 'test2', 'test3']
    }
  }
};

const schemeSourceNoPlugs = new SchemeSourceNoPlugs(optionsNoPlugs.source, schemePunkScheme, {});

module.exports = {
  classConstruction: (test) => {
    test.expect(1);
    test.deepEqual(
      schemeSource.constructor.name,
      'schemePunkSourceBase'
    );
    test.done();
  },
  classConstructionNoPlugin: (test) => {
    // Test that it is a desination.
    // Test that it is not destination base
    test.deepEqual(
      schemeSourceNoPlugs.constructor.name,
      'schemePunkSourceBase'
    );
    test.done();
  },
  getSource: (test) => {
    test.expect(1);
    test.deepEqual(
      schemeSource.getSource(),
      schemePart
    );
    test.done();
  },
  testBaseSourceSuperCall: (test) => {
    test.expect(1);
    test.deepEqual(
      schemeSourceNoPlugs.getSource(),
      ['test1', 'test2', 'test3']
    );
    test.done();
  }
};
