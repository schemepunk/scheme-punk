'use strict';

// Require mixin.
const PrependValues = require('../lib/plugins/transform/prependValues');

// A super class.
const tester = class {
  constructor() {
    this.options = {
      sourcePrepend: '-'
    };
  }
};

// Create implementing class with mixin for first case.
const One = class SchemePunkTransformTest extends PrependValues(tester) {};

// Test case value.
const value = [
  'test1',
  'test2',
  'test3'
];
const objTest = new One();

module.exports = {
  prependValues: (test) => {
    objTest.transform(value);
    test.deepEqual(
      objTest.value,
      ['-test1', '-test2', '-test3']
    );
    test.done();
  },
  prependValuesWithSuper: (test) => {
    const tester2 = class {
      transform(prepvalue) {
        this.value = prepvalue;
      }
    };

    const Two = class SchemePunkTransformTest extends PrependValues(tester2) {};

    const objTest2 = new Two();
    objTest2.transform(value);
    test.deepEqual(
      objTest2.value,
      ['test1', 'test2', 'test3']
    );
    test.done();
  }
};
