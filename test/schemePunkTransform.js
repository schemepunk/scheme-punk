'use strict';

const SchemePunkTransform = require('../lib/transform/schemePunkTransform');

const schemePunkTransform = new SchemePunkTransform();

// console.log(schemePunkTransform.constructor.name);

module.exports = {

  schemePunkTransform: (test) => {
    const value = 'test';
    test.deepEqual(
      schemePunkTransform.transform(value),
      'test'
    );
    test.done();
  },
  schemePunkGetTransform: (test) => {
    const value = 'test';
    schemePunkTransform.value = schemePunkTransform.transform(value);
    test.deepEqual(
      schemePunkTransform.getTransformedValue(),
      'test'
    );
    test.done();
  }
};
