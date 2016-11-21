'use strict';

// Require mixin.
const AppendValues = require('../lib/plugins/transform/appendValues');

// A super class.
const tester = class {
  constructor() {
    this.options = {
      sourceAppend: '-'
    };
  }
};

// Create implementing class with mixin for first case.
const One = class SchemePunkTransformTest extends AppendValues(tester) {};

// Test case value.
const value = [
  'test1',
  'test2',
  'test3'
];
const objTest = new One();

// console.log(schemePunkTransform.constructor.name);

module.exports = {
  appendValues: (test) => {
    objTest.transform(value);
    test.deepEqual(
      objTest.value,
      ['test1-', 'test2-', 'test3-']
    );
    test.done();
  },
  appendValuesWithSuper: (test) => {
    const tester2 = class {
      transform(transvalue) {
        this.value = transvalue;
      }
    };

    const Two = class SchemePunkTransformTest extends AppendValues(tester2) {};

    const objTest2 = new Two();
    objTest2.transform(value);
    test.deepEqual(
      objTest2.value,
      ['test1', 'test2', 'test3']
    );
    test.done();
  }
};
