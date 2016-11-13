'use strict';

// Require mixin.
const OriginalSchemeSource = require('../lib/plugins/source/originalSchemeSource');

// Test scheme.
const scheme = {
  originalScheme: {
    test1: 'thing',
    test2: 'thing2',
    test3: 'thing3'
  }
};

// A super class.
const tester = class {
  constructor() {
    this.scheme = scheme;
  }
};

// A second super class with an setOrigin Implemented.
const tester2 = class {
  constructor() {
    this.scheme = scheme;
  }
  setOrigin(originValue) {
    this.retrievedOrigin = Object.keys(originValue);
  }
};


// Create implementing class with mixin for first case.
const One = class SchemePunkSchemeSourceTest extends OriginalSchemeSource(tester) {};


const objTest = new One();

// Create implementing class with mixin for second case.
const Two = class SchemePunkSchemeSourceTest2 extends OriginalSchemeSource(tester2) {
  setOrigin(passedValue) {
    super.setOrigin(passedValue);
  }
};

const objTest2 = new Two();

// console.log(schemePunkTransform.constructor.name);

module.exports = {
  retrieveOrigin: (test) => {
    objTest.setOrigin();
    test.deepEqual(
      objTest.retrievedOrigin,
      {
        test1: 'thing',
        test2: 'thing2',
        test3: 'thing3'
      }

    );
    test.done();
  },
  retrieveOriginCallSuper: (test) => {
    objTest2.setOrigin();
    test.deepEqual(
      objTest2.retrievedOrigin,
      ['test1', 'test2', 'test3']
    );
    test.done();
  }
};
