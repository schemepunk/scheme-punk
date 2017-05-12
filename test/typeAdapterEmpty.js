'use strict';

const typeAdapter = require('../lib/plugins/transform/typeAdapter');

const superClass = require('../lib/transform/schemePunkTransform');

const Implemented = class implementer extends typeAdapter(superClass) {
  transform(value) {
    this.value = super.transform(value);
  }
};

const testClass = new Implemented();

const testObject = {
  item1: 'thing',
  item2: {}
};

testClass.options = {};

module.exports = {
  testObjectValuesNoEmpty: (test) => {
    test.expect(1);
    testClass.options.typeAdapterObjectValues = true;
    testClass.options.typeAdapter = {
      includeEmpty: false
    };
    testClass.transform(testObject);
    test.deepEqual(
      testClass.value,
      {
        item1: 'thing'
      }
    );
    test.done();
  }
};
