'use strict';

// Require mixin.
const FilterAttributes = require('../lib/plugins/transform/filterAttributes');
const typeAdapter = require('../lib/plugins/transform/typeAdapter');

// Require a super class.
const superClass = require('../lib/transform/schemePunkTransform');

// Create an implementing class using mixin and super.
const Implemented = class implementer extends typeAdapter(FilterAttributes(superClass)) {
  transform(value) {
    this.value = super.transform(value);
  }
};

const testClass = new Implemented();

// Set options source prepend.
testClass.options = {
  filterItems: [
    'junkAttribute',
  ],
  filterBias: 'out',
  typeAdapterObjectValues: true
};

// Test case value.
const value = {
  attribute1: {
    goodAttribute: '1',
    junkAttribute: '1-junk'
  },
  attribute2: {
    goodAttribute: '2',
    junkAttribute: '2-junk'
  },
  attribute3: {
    goodAttribute: '3',
    junkAttribute: '3-junk'
  },
  attribute4: {
    goodAttribute: '4',
    junkAttribute: '4-junk'
  }
};

module.exports = {
  filterAttributesMultiOut: (test) => {
    testClass.transform(value);
    test.deepEqual(
      testClass.value,
      {
        attribute1: {
          goodAttribute: '1'
        },
        attribute2: {
          goodAttribute: '2'
        },
        attribute3: {
          goodAttribute: '3'
        },
        attribute4: {
          goodAttribute: '4'
        }
      }
    );
    test.done();
  }
};
