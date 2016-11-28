'use strict';

// Require mixin.
const ObjectKeysTransform = require('../lib/plugins/transform/objectKeysTransform');

// Require a super class.
const superClass = require('../lib/transform/schemePunkTransform');

// Create an implementing class using mixin and super.
const Implemented = class implementer extends ObjectKeysTransform(superClass) {
  transform(value) {
    this.value = super.transform(value);
  }
};

// Test case value.
const value = {
  test1: 'thing',
  test2: 'thing2',
  test3: 'thing3'
};

const testClass = new Implemented();

module.exports = {
  objectKeysTransformNoSuper: (test) => {
    testClass.transform(value);
    test.deepEqual(
      testClass.value,
      ['test1', 'test2', 'test3']
    );
    test.done();
  }
};
