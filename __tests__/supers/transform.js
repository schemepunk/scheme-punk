'use strict';

const SchemePunkTransform = require('../../lib/supers/transform');

let tmpMocks = [];
let converterEx;
let schemePunkTransform;
let schemePunkTransform2;
let schemePunkTransform3;

describe('Scheme Punk Transform Super', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
    const scheme = {};
    const options = {
      origin: {
        test: 'this test'
      },
      target: 'test'
    };
    schemePunkTransform = new SchemePunkTransform();
    schemePunkTransform.init(options);
    const holdOvers = {
      src: {
        testive: 'test'
      },
      otherProp: 'otherValue'
    };
    const holdOvers2 = {
      otherProp: 'otherValue'
    };

    schemePunkTransform2 = new SchemePunkTransform();
    schemePunkTransform2.init(options, holdOvers);
    schemePunkTransform3 = new SchemePunkTransform();
    schemePunkTransform3.init(options, holdOvers2);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('getOptions', () => {
    expect.assertions(1);
    return expect(schemePunkTransform.options)
    .toEqual(
      {
        origin: {
          test: 'this test'
        },
        target: 'test'
      }
    )
  });

  test('getHoldOvers Empty.', () => {
    expect.assertions(1);
    return schemePunkTransform.getHoldOvers()
    .then(holdOver => expect(holdOver).toEqual(
      {}
    ));
  });

  test('getHoldovers Populated', () => {
    expect.assertions(1);
    return schemePunkTransform2.getHoldOvers()
    .then(source => expect(source).toEqual(
      {
        src: {
          testive: 'test'
        },
        otherProp: 'otherValue'
      }
    ))
  });

  test('transform', () => {
    expect.assertions(1);
    return expect(schemePunkTransform.transform('transformTest'))
    .toEqual(
      'transformTest'
    );
  });

  test('get transform', () => {
    expect.assertions(1);
    schemePunkTransform.value = 'transformTest';
    return schemePunkTransform.getTransformedValue()
    .then(testItem => expect(testItem)
    .toEqual(
      'transformTest'
    ));
  });
});
