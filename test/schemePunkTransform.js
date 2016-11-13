'use strict';

const SchemePunkTransform = require('../lib/transform/schemePunkTransform');

const schemePunkTransform = new SchemePunkTransform();

// console.log(schemePunkTransform.constructor.name);

module.exports = {

  schemePunkTransform: (test) => {
    const value = 'test';
    schemePunkTransform.transform(value);
    test.deepEqual(
      schemePunkTransform.getTransformedValue(),
      'test'
    );
    test.done();
  }
};
