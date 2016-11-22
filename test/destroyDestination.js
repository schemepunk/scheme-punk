'use strict';

// Require mixin.
const DestroyDestination = require('../lib/plugins/destination/destroyDestination');
const _ = require('lodash');

const testScheme = {
  test1: 'item',
  test2: 'item',
  test3: 'item'
};

const scheme = {
  originalScheme: testScheme,
  activeScheme: testScheme,
  newScheme: null
};

// A super class.
const tester = class {
  constructor() {
    this.scheme = scheme;
  }
};

// Create implementing class with mixin for first case.
const One = class SchemePunkDestinationTest extends DestroyDestination(tester) {
  /**
   * Retrieve the destination target, a key in the scheme.
   * @return this.destination string.
   *  Returns a key for scheme.
   */
  getDestination() {
    this.destination = 'activeScheme';
    return this.destination;
  }
  /**
   * Retrieve a target for the writer.
   * @return target
   *  Target value.
   */
  getTarget() {
    this.target = 'test2';
    return this.target;
  }
};

const objTest = new One();

// console.log(schemePunkTransform.constructor.name);

module.exports = {
  destroyDestination: (test) => {
    objTest.writeDestinationTarget();
    test.deepEqual(
      _.has(objTest, 'scheme.activeScheme.test2'),
      false
    );
    test.done();
  }
};
