'use strict';

const typeAdapter = require('../lib/plugins/transform/typeAdapter');

const superClass = require('../lib/transform/schemePunkTransform');

const prePend = require('../lib/plugins/transform/prependValues');

const Implemented = class implementer extends typeAdapter(prePend(superClass)) {
  transform(value) {
    this.value = super.transform(value);
  }
};

const testClass = new Implemented();

// Set options source prepend.
testClass.options = {
  sourcePrepend: 'thething',
  adapterPrevent: ['number']
};

// test string.
const testString = 'testString';

// test array.
const testArray = [
  'test1',
  'test2',
  'test3'
];

// test obj.
const testObject = {
  test1: [
    'test'
  ],
  test2: [
    'boo'
  ]
};

const testNull = null;

const testNumber = 1;

module.exports = {
  testString: (test) => {
    test.expect(1);
    testClass.transform(testString);
    test.deepEqual(
      testClass.value,
      'thethingtestString'
    );
    test.done();
  },
  testArray: (test) => {
    test.expect(1);
    const testClass1 = new Implemented();

    // Set options source prepend.
    testClass1.options = {
      sourcePrepend: 'thething',
      adapterPrevent: []
    };
    testClass1.transform(testArray);
    test.deepEqual(
      testClass1.value,
      [
        'thethingtest1',
        'thethingtest2',
        'thethingtest3'
      ]
    );
    test.done();
  },
  testObject: (test) => {
    test.expect(1);
    testClass.transform(testObject);
    test.deepEqual(
      testClass.value,
      {
        thethingtest1: [
          'test'
        ],
        thethingtest2: [
          'boo'
        ]
      }
    );
    test.done();
  },
  testObjectValues: (test) => {
    test.expect(1);
    testClass.options.typeAdapterObjectValues = true;
    testClass.transform(testObject);
    test.deepEqual(
      testClass.value,
      {
        test1: 'thethingtest',
        test2: 'thethingboo'
      }
    );
    test.done();
  },
  testObjectArray: (test) => {
    test.expect(1);
    testClass.options.typeAdapterObjectValues = false;
    testClass.options.typeAdapterObjectValuesArray = true;
    testClass.transform(testObject);
    test.deepEqual(
      testClass.value,
      [
        'thethingtest',
        'thethingboo'
      ]
    );
    test.done();
  },
  testBoolean: (test) => {
    test.expect(1);
    test.throws(() => {
      testClass.transform(true);
    }, 'Bool did not throw an error.');
    test.done();
  },
  testNoAdapter: (test) => {
    test.expect(1);
    testClass.options = {
      adapterPrevent: 'number'
    };
    testClass.transform(testNumber);
    test.deepEqual(
      testClass.value,
      1
    );
    test.done();
  },
  testNumber: (test) => {
    test.expect(1);
    testClass.options = {
      sourcePrepend: 'thething',
      adapterPrevent: []
    };
    testClass.transform(testNumber);
    test.deepEqual(
      testClass.value,
      'thething1'
    );
    test.done();
  },
  testNull: (test) => {
    test.expect(1);
    test.throws(() => {
      testClass.transform(testNull);
    }, 'Null did not throw an error.');
    test.done();
  }
};
