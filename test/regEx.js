'use strict';

// Require mixin.
const DelimitValues = require('../lib/plugins/transform/regexWordBoundariesValues');

// A super class.
const tester = class {};

// Create implementing class with mixin for first case.
const One = class SchemePunkTransformTest extends DelimitValues(tester) {};

// Test case value.
const value = [
  'test1',
  'test2',
  'test3'
];
const objTest = new One();

// console.log(schemePunkTransform.constructor.name);

module.exports = {
  delimitValues: (test) => {
    objTest.transform(value);
    test.deepEqual(
      objTest.value,
      '(\btest1\b|\btest2\b|\btest3\b|,)*'
    );
    test.done();
  },
  delimitValuesWithSuper: (test) => {
    const tester2 = class {
      transform(transvalue) {
        this.value = transvalue;
      }
    };

    const Two = class SchemePunkTransformTest extends DelimitValues(tester2) {};

    const objTest2 = new Two();
    objTest2.transform(value);
    test.deepEqual(
      objTest2.value,
      '(\btest1\b|\btest2\b|\btest3\b|,)*'
    );
    test.done();
  }
};
