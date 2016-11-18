'use strict';

const SchemePunkSource = require('../lib/source/schemePunkSource');

const scheme = {};
const options = {
  origin: {
    test: 'this test'
  },
  target: 'test'
};

const schemePunkSource = new SchemePunkSource(options, scheme);

module.exports = {
  getOrigin: (test) => {
    test.deepEqual(
      schemePunkSource.getOrigin(),
      {
        test: 'this test'
      }
    );
    test.done();
  },
  getTarget: (test) => {
    test.deepEqual(
      schemePunkSource.getSchemePunkSourceTarget(),
      'test'
    );
    test.done();
  },
  getSource: (test) => {
    test.deepEqual(
      schemePunkSource.getSource(),
      'this test'
    );
    test.done();
  }
};
