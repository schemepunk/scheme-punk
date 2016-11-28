'use strict';

// Require mixin.
const PrependValues = require('../lib/plugins/transform/prependValues');

// Require a super class.
const superClass = require('../lib/transform/schemePunkTransform');

// Create an implementing class using mixin and super.
const Implemented = class implementer extends PrependValues(superClass) {
  transform(value) {
    this.value = super.transform(value);
  }
};

const testClass = new Implemented();

// Set options source prepend.
testClass.options = {
  sourcePrepend: '-'
};

// Test case value.
const value = 'test3';

module.exports = {
  prependValues: (test) => {
    testClass.transform(value);
    test.deepEqual(
      testClass.value,
      '-test3'
    );
    test.done();
  }
};
