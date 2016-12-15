'use strict';

// Require mixin.
const RegExBoundary = require('../lib/plugins/transform/regexWordBoundariesValues');

// Require a super class.
const superClass = require('../lib/transform/schemePunkTransform');

// Create an implementing class using mixin and super.
const Implemented = class implementer extends RegExBoundary(superClass) {
  transform(value) {
    this.value = super.transform(value);
  }
};

// Test case value.
const value = [
  'test1',
  '-test',
  'test3'
];

const testClass = new Implemented();

module.exports = {
  regExTransform: (test) => {
    testClass.transform(value);
    test.deepEqual(
      testClass.value,
      '(\\btest1\\B|\\B-test\\b|\\btest3\\B|,)*'
    );
    test.done();
  }
};
