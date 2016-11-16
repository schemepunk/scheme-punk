'use strict';

const SchemeDestinationBase = require('../lib/destination/schemePunkDestinationBase');
const options = require('./helpers/schemePunkTestOptions');
const fs = require('fs-extra');

const bit = ['title', 'description', 'numberProperty'];
const schemePunkScheme = fs.readJSONSync('./test/helpers/schemePunkMockScheme.json');

// Create a scheme Base with a plugin
// const SchemeDestination = SchemeDestinationBase();
// const schemeDestination = new SchemeDestination({}, bit, schemePunkScheme);

// Create a scheme Base without a plugin;
const SchemeDestinationNoPlug = SchemeDestinationBase();
const schemeDestinationNoPlug = new SchemeDestinationNoPlug(
  options.destination,
  bit,
  schemePunkScheme
);

module.exports = {
  classConstructionNoPlugin: (test) => {
    // Test that it is a desination.
    // Test that it is not destination base
    test.deepEqual(
      schemeDestinationNoPlug.constructor.name,
      'schemePunkDestinationBase'
    );
    test.done();
  }
};
