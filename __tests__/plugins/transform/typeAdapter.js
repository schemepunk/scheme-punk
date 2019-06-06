'use strict';

const TypeAdapter = require('../../../lib/plugins/transform/typeAdapter');

class BaseXform {
  constructor(options) {
    this.options = options;
  }

  async transform(value) { // eslint-disable-line class-methods-use-this
    return value;
  }
}

const prePend = require('../../../lib/plugins/transform/prependValues');

const Implemented = class implementer extends TypeAdapter(prePend(BaseXform)) {
  async transform(value) {
    const xformedValue = await super.transform(value);
    this.value = xformedValue;
    return this.value;
  }
};

const Implemented2 = class implementer extends TypeAdapter(BaseXform) {
  async transform(value) {
    const xformedValue = await super.transform(value);
    this.value = xformedValue;
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

const testObjectMerge = {
  test1: {
    foo: 'bar',
    ary: [
      1
    ]
  },
  test2: {
    bar: 'baz',
    ary: [
      1
    ]
  },
  test3: {}
};

const testNull = null;

const testNumber = 1;

describe('Append Values test', () => {
  test('test string.', async () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: ['number']
    };
    const val = await typeAdapter.transform(testString);
    expect(val).toBe('thethingtestString');
  });
  test('test array.', async () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: []
    };
    const val = await typeAdapter.transform(testArray);
    expect(val).toEqual([
      'thethingtest1',
      'thethingtest2',
      'thethingtest3'
    ]);
  });
  test('test object.', async () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: ['number']
    };
    const val = await typeAdapter.transform(testObject);
    expect(val).toEqual({
      thethingtest1: [
        'test'
      ],
      thethingtest2: [
        'boo'
      ]
    });
  });
  test('test object values.', async () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: ['number']
    };
    typeAdapter.options.typeAdapterObjectValues = true;
    const val = await typeAdapter.transform(testObject);
    expect(val).toEqual({
      test1: 'thethingtest',
      test2: 'thethingboo'
    });
  });
  test('test object merge.', async () => {
    typeAdapter2.options = {
      typeAdapterObjectValuesMerge: true,
      typeAdapter: {
        includeEmpty: false
      }
    };
    typeAdapter2.options.typeAdapterObjectValuesMerge = true;
    const val = await typeAdapter2.transform(testObjectMerge);

    expect(val).toEqual({
      ary: [1],
      foo: 'bar',
      bar: 'baz',
    });

    typeAdapter2.options.typeAdapter.concatArrays = true;
    const val2 = await typeAdapter2.transform(testObjectMerge);

    expect(val2).toEqual({
      ary: [1, 1],
      foo: 'bar',
      bar: 'baz',
    });

    typeAdapter2.options.typeAdapter.uniqArrays = true;

    const val3 = await typeAdapter2.transform(testObjectMerge);

    expect(val3).toEqual({
      ary: [1],
      foo: 'bar',
      bar: 'baz',
    });
  });
  test('test object array.', async () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: ['number']
    };
    typeAdapter.options.typeAdapterObjectValues = false;
    typeAdapter.options.typeAdapterObjectValuesArray = true;
    const val = await typeAdapter.transform(testObject);

    expect(val).toEqual([
      'thethingtest',
      'thethingboo'
    ]);
  });
  test('Test boolean throws', async () => {
    try {
      await typeAdapter.transform(true);
    }
    catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
  test('test Number ignored.', async () => {
    typeAdapter.options = {
      adapterPrevent: 'number'
    };
    const val = await typeAdapter.transform(testNumber);
    expect(val).toEqual(1);
  });
  test('test Number.', async () => {
    typeAdapter.options = {
      sourcePrepend: 'thething',
      adapterPrevent: []
    };
    const val = await typeAdapter.transform(testNumber);
    expect(val).toEqual('thething1');
  });
  test('test Null.', async () => {
    typeAdapter.options = {
      adapterPrevent: []
    };
    try {
      await typeAdapter.transform(testNull);
    }
    catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
  test('testObjectValuesNoEmpty', async () => {
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
    await typeAdapter2.transform(testObjecta);
    expect(typeAdapter2.value).toEqual({
      item1: 'thing'
    });
  });
});
