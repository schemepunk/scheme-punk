'use strict';

const SchemeDestination = require('../lib/destination/schemePunkDestination');

const scheme = {
  originalScheme: {},
  activeScheme: {
    test: 'old value'
  },
  newScheme: null
};
const options = {
  target: 'test',
  destinationValue: 'activeScheme'
};
const scheme2 = {
  activeScheme: {}
};
const transformedValue = 'a new value';

const schemePunkDestination = new SchemeDestination(options, transformedValue, scheme);
const schemePunkDestination2 = new SchemeDestination(options, transformedValue, scheme2);


module.exports = {
  getTarget: (test) => {
    test.deepEqual(
      schemePunkDestination.getTarget(),
      'test'
    );
    test.done();
  },
  getValue: (test) => {
    test.deepEqual(
      schemePunkDestination.getValue(),
      'a new value'
    );
    test.done();
  },
  getDestination: (test) => {
    test.deepEqual(
      schemePunkDestination.getDestination(),
      'activeScheme'
    );
    test.done();
  },
  validate: (test) => {
    test.deepEqual(
      schemePunkDestination.validateDestinationTarget(),
      true
    );
    test.done();
  },
  validateFalse: (test) => {
    test.deepEqual(
      schemePunkDestination2.validateDestinationTarget(),
      false
    );
    test.done();
  },
  writeDestinationTarget: (test) => {
    schemePunkDestination.writeDestinationTarget();
    test.deepEqual(
      schemePunkDestination.getScheme(),
      {
        originalScheme: {},
        activeScheme: {
          test: 'a new value'
        },
        newScheme: null
      }
    );
    test.done();
  },
  promote: (test) => {
    schemePunkDestination.promoteActiveToNewScheme();
    test.deepEqual(
      schemePunkDestination.getScheme(),
      {
        originalScheme: {},
        activeScheme: {
          test: 'a new value'
        },
        newScheme: {
          test: 'a new value'
        }
      }
    );
    test.done();
  },
  writeNonExistant: (test) => {
    schemePunkDestination2.writeDestinationTarget();
    test.deepEqual(
      schemePunkDestination2.getScheme(),
      {
        activeScheme: {
          test: 'a new value'
        }
      }
    );
    test.done();
  },
  setHoldOvers: (test) => {
    schemePunkDestination2.setHoldOvers({test: 'test'});
    test.deepEqual(
      schemePunkDestination2.holdOvers,
      {
        test: 'test'
      }
    );
    test.done();
  },
  getHoldOvers: (test) => {
    schemePunkDestination2.setHoldOvers({test: 'test'});
    test.deepEqual(
      schemePunkDestination2.getHoldOvers(),
      {
        test: 'test'
      }
    );
    test.done();
  }
};
