'use strict';

// Require mixin.
const PushDestination = require('../lib/plugins/destination/pushDestination');
const _ = require('lodash');

const testScheme = {
  test1: 'item',
  test2: [1],
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
const One = class SchemePunkDestinationTest extends PushDestination(tester) {
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
   * @return this.value.
   *  Returns the transformed value.
   */
  getValue() {
    return 'apple';
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

// Create implementing class with mixin for first case.
const Two = class SchemePunkDestinationTest extends PushDestination(tester) {
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
   * @return this.value.
   *  Returns the transformed value.
   */
  getValue() {
    return 'apple';
  }

  /**
   * Retrieve a target for the writer.
   * @return target
   *  Target value.
   */
  getTarget() {
    this.target = 'test1';
    return this.target;
  }
};

const objTest = new One();

// console.log(schemePunkTransform.constructor.name);

module.exports = {
  pushDestination: (test) => {
    objTest.writeDestinationTarget();
    test.deepEqual(
      objTest.scheme.activeScheme.test2,
      [1, 'apple']
    );
    test.done();
  },
  pushDestinationNotArray: (test) => {
    const objTest2 = new Two();
    objTest2.writeDestinationTarget();
    test.deepEqual(
      objTest2.scheme.activeScheme.test1,
      ['item', 'apple']
    );
    test.done();
  },
};
