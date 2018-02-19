'use strict';

const TypeAdapter = require('../../../lib/plugins/transform/typeAdapter');

class BaseXform {
  constructor(options) {
    this.options = options;
  }

  transform(value) { // eslint-disable-line class-methods-use-this
    return value;
  }
}

const prePend = require('../../../lib/plugins/transform/prependValues');

const Implemented = class implementer extends TypeAdapter(prePend(BaseXform)) {
  transform(value) {
    this.value = super.transform(value);
    // Return for the purposes of this unit test.
    return this.value;
  }
};

const Implemented2 = class implementer extends TypeAdapter(BaseXform) {
  transform(value) {
    this.value = super.transform(value);
    // Return for the purposes of this unit test.
    return this.value;
  }
};

const typeAdapter = new Implemented();
const typeAdapter2 = new Implemented2();

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

describe('Append Values test', () => {
  test('test string.', () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: ['number']
    };
    expect(typeAdapter.transform(testString)).toBe('thethingtestString');
  });
  test('test array.', () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: []
    };
    expect(typeAdapter.transform(testArray)).toEqual([
      'thethingtest1',
      'thethingtest2',
      'thethingtest3'
    ]);
  });
  test('test object.', () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: ['number']
    };
    expect(typeAdapter.transform(testObject)).toEqual({
      thethingtest1: [
        'test'
      ],
      thethingtest2: [
        'boo'
      ]
    });
  });
  test('test object values.', () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: ['number']
    };
    typeAdapter.options.typeAdapterObjectValues = true;
    expect(typeAdapter.transform(testObject)).toEqual({
      test1: 'thethingtest',
      test2: 'thethingboo'
    });
  });
  test('test object array.', () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: ['number']
    };
    typeAdapter.options.typeAdapterObjectValues = false;
    typeAdapter.options.typeAdapterObjectValuesArray = true;
    expect(typeAdapter.transform(testObject)).toEqual([
      'thethingtest',
      'thethingboo'
    ]);
  });
  test('Test boolean throws', () => {
    expect(() => typeAdapter.transform(true)).toThrow();
  });
  test('test Number ignored.', () => {
    typeAdapter.options = {
      adapterPrevent: 'number'
    };
    expect(typeAdapter.transform(testNumber)).toEqual(1);
  });
  test('test Number.', () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: []
    };
    expect(typeAdapter.transform(testNumber)).toEqual('thething1');
  });
  test('test Null.', () => {
    typeAdapter.options = {
      adapterPrevent: []
    };
    expect(() => typeAdapter.transform(testNull)).toThrow();
  });
  test('testObjectValuesNoEmpty', () => {
    typeAdapter2.options = {
      typeAdapterObjectValues: true,
      typeAdapter: {
        includeEmpty: false
      }
    };
    const testObjecta = {
      item1: 'thing',
      item2: {}
    };
    typeAdapter2.transform(testObjecta);
    expect(typeAdapter2.value).toEqual({
      item1: 'thing'
    });
  });
});
