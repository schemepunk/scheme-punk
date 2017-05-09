'use strict';

// Require mixin.
const FilterAttributes = require('../lib/plugins/transform/filterAttributes');

// Require a super class.
const superClass = require('../lib/transform/schemePunkTransform');

// Create an implementing class using mixin and super.
const Implemented = class implementer extends FilterAttributes(superClass) {
  transform(value) {
    this.value = super.transform(value);
  }
};

const testClass = new Implemented();

// Set options source prepend.
testClass.options = {
  filterItems: [
    'attribute2',
    'attribute4'
  ],
  filterBias: 'out'
};

// Test case value.
const value = {
  attribute1: 1,
  attribute2: 2,
  attribute3: 3,
  attribute4: 4
};

module.exports = {
  filterAttributesOut: (test) => {
    testClass.options = {
      filterItems: [
        'attribute2',
        'attribute4'
      ],
      filterBias: 'out'
    };
    testClass.transform(value);
    test.deepEqual(
      testClass.value, {
        attribute1: 1,
        attribute3: 3
      }
    );
    test.done();
  },
  filterAttributesIn: (test) => {
    testClass.options = {
      filterItems: [
        'attribute2',
        'attribute4'
      ],
      filterBias: 'in'
    };
    testClass.transform(value);
    test.deepEqual(
      testClass.value, {
        attribute2: 2,
        attribute4: 4
      }
    );
    test.done();
  }
};
