'use strict';

const SchemePunkSource = require('../lib/source/schemePunkSource');

const scheme = {};
const options = {
  origin: {
    test: 'this test'
  },
  target: 'test'
};

const schemePunkSource = new SchemePunkSource(options, scheme, {});
const holdOvers = {
  src: {
    testive: 'test'
  },
  otherProp: 'otherValue'
};
const holdOvers2 = {
  otherProp: 'otherValue'
};

const schemePunkSource2 = new SchemePunkSource(options, scheme, holdOvers);
const schemePunkSource3 = new SchemePunkSource(options, scheme, holdOvers2);

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
  },
  setHoldOversWithValues: (test) => {
    test.deepEqual(
      schemePunkSource2.holdOvers,
      {
        otherProp: 'otherValue',
        testive: 'this test'
      }
    );
    test.done();
  },
  getHoldOversWithValues: (test) => {
    test.deepEqual(
      schemePunkSource2.getHoldOvers(),
      {
        otherProp: 'otherValue',
        testive: 'this test'
      }
    );
    test.done();
  },
  setHoldOversWithoutValuesNoProp: (test) => {
    test.deepEqual(
      schemePunkSource.holdOvers,
      {}
    );
    test.done();
  },
  getHoldOversWithoutValues: (test) => {
    test.deepEqual(
      schemePunkSource.getHoldOvers(),
      {}
    );
    test.done();
  },
  getHoldOversWithValuesWithProp: (test) => {
    test.deepEqual(
      schemePunkSource3.getHoldOvers(),
      {
        otherProp: 'otherValue'
      }
    );
    test.done();
  },
};
