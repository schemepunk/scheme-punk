'use strict';

// Require mixin.
const MergeIntoDestination = require('../lib/plugins/destination/mergeIntoDestination');

const testScheme = {
  test1: 'item',
  test2: 'item',
  test3: ['this', 'that', 'even', 'dumb']
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
const One = class SchemePunkDestinationTest extends MergeIntoDestination(tester) {
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
    this.target = 'test3';
    return this.target;
  }

  getValue() {
    this.value = ['knope', 'ron', 'ann'];
    return this.value;
  }
 };

const objTest = new One();

// console.log(schemePunkTransform.constructor.name);

module.exports = {
  mergeIntoDestination: (test) => {
    objTest.writeDestinationTarget();
    test.deepEqual(
      objTest.scheme.activeScheme.test3,
      ['this', 'that', 'even', 'dumb', 'knope', 'ron', 'ann']
    );
    test.done();
  }
};
