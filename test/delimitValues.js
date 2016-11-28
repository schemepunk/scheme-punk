'use strict';

// Require mixin.
const DelimitValues = require('../lib/plugins/transform/delimitValues');

// Require a super class.
const superClass = require('../lib/transform/schemePunkTransform');

// Create an implementing class using mixin and super.
const Implemented = class implementer extends DelimitValues(superClass) {
  transform(value) {
    this.value = super.transform(value);
  }
};


// Test case value.
const value = [
  'test1',
  'test2',
  'test3'
];

const testClass = new Implemented();

// console.log(schemePunkTransform.constructor.name);

module.exports = {
  delimitValues: (test) => {
    testClass.transform(value);
    test.deepEqual(
      testClass.value,
      'test1,test2,test3'
    );
    testClass.options = {
      sourceDelimiter: '-'
    };
    testClass.transform(value);
    test.deepEqual(
      testClass.value,
      'test1-test2-test3'
    );
    test.done();
  }
};
