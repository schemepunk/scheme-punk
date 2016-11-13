'use strict';
// Require mixin.
const ObjectKeysTransform = require('../lib/plugins/transform/objectKeysTransform');

// A super class.
const tester = class {};

// A second super class.
const tester2 = class {
  transform(value) {
    this.value = value.toString();
  }
}

// Create implementing class with mixin for first case.
const one = class SchemePunkTransformTest extends ObjectKeysTransform(tester) {
  constructor () {
    super();
  }
}
// Test case value.
const value = {
  test1: 'thing',
  test2: 'thing2',
  test3: 'thing3'
};
const objTest = new one();

// Create implementing class with mixin for second case.
const two = class SchemePunkTransformTest2 extends ObjectKeysTransform(tester2) {
  constructor () {
    super();
  }
  transform(value) {
    super.transform(value);
  }
};

// Test case value 2.
const value2 = {
  test1: 'thing',
  test2: 'thing2',
  test3: 'thing3'
};
const objTest2 = new two();

// console.log(schemePunkTransform.constructor.name);

module.exports = {
  objectKeysTransformNoSuper: (test) => {
    objTest.transform(value);
    test.deepEqual(
      objTest.value,
      ['test1', 'test2', 'test3']
    );
    test.done();
  },
  objectKeysTransformWithSuper: (test) => {
    objTest2.transform(value2);
    test.deepEqual(
      objTest2.value,
      'test1,test2,test3'
    );
    test.done();
  }
};
