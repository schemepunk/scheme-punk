'use strict';

// Require mixin.
const AppendValues = require('../lib/plugins/transform/appendValues');

const superClass = require('../lib/transform/schemePunkTransform');

const Implemented = class implementer extends AppendValues(superClass) {
  transform(value) {
    this.value = super.transform(value);
  }
};

const testClass = new Implemented();

// Set options source prepend.
testClass.options = {
  sourceAppend: '-'
};

// Test case value.
const value = 'test3';

module.exports = {
  appendValues: (test) => {
    testClass.transform(value);
    test.deepEqual(
      testClass.value,
      'test3-'
    );
    test.done();
  }
};
