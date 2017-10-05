'use strict';

const SchemePunkSource = require('../../lib/supers/source');

let tmpMocks = [];
let converterEx;
let schemePunkSource;
let schemePunkSource2;
let schemePunkSource3;


describe('Scheme Punk Source Super', () => {
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
    schemePunkSource = new SchemePunkSource();
    schemePunkSource.init(options, scheme, {});
    const holdOvers = {
      src: {
        testive: 'test'
      },
      otherProp: 'otherValue'
    };
    const holdOvers2 = {
      otherProp: 'otherValue'
    };

    schemePunkSource2 = new SchemePunkSource();
    schemePunkSource2.init(options, scheme, holdOvers);
    schemePunkSource3 = new SchemePunkSource();
    schemePunkSource3.init(options, scheme, holdOvers2);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });



  test('getOrigin', () => {
    expect.assertions(1);
    return schemePunkSource.getOrigin()
    .then(source => expect(source).toEqual(
      {
        test: 'this test'
      }
    ))
  });

  test('getTarget', () => {
    expect.assertions(1);
    schemePunkSource.getSchemePunkSourceTarget()
    .then(source => expect(source).toEqual(
      'test'
    ));
  });

  test('getSource', () => {
    expect.assertions(1);
    return schemePunkSource.getSource()
    .then(source => expect(source).toEqual(
      'this test'
    ))
  });

  test('setHoldOversWithValues', () => {
    expect.assertions(1);
    schemePunkSource.setHoldOvers(
      {
        src: {testive: 'test'},
        otherProp: 'otherValue',
        testive: {}
      }
    );
    return schemePunkSource.getHoldOvers()
    .then(thing => thing)
    .then(thing => expect(thing)
    .toEqual(
      {
        src: {testive: 'test'},
        otherProp: 'otherValue',
        testive: "this test"
      }
    ));
  });

  test('getHoldOversWithValues', () => {
    expect.assertions(1);
    return schemePunkSource2.getHoldOvers()
    .then(thing => expect(thing)
    .toEqual(
      {
        src: {testive: 'test'},
        otherProp: 'otherValue',
        testive: 'this test'
      }
    ));
  });

  test('setHoldOversWithoutValuesNoProp', () => {
    expect.assertions(1);
    return schemePunkSource.getHoldOvers()
    .then(item => expect(item).toEqual({}));
  });

  test('getHoldOversWithoutValues', () => {
    expect.assertions(1);
    return schemePunkSource3.getHoldOvers()
    .then(item => expect(item)
    .toEqual(
      {
        otherProp: 'otherValue'
      }
    ))
  });
});
