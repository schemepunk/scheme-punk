'use strict';

const SchemePunkSource = require('../../lib/supers/source');

let tmpMocks = [];
let schemePunkSource;
let schemePunkSource2;
let schemePunkSource3;


describe('Scheme Punk Source Super', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
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
    const callPath = './';
    schemePunkSource2 = new SchemePunkSource();
    schemePunkSource2.init(options, scheme, holdOvers, callPath);
    schemePunkSource3 = new SchemePunkSource();
    schemePunkSource3.init(options, scheme, holdOvers2, callPath);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('getOrigin', () => {
    expect.assertions(1);
    return schemePunkSource.getOrigin()
      .then((source) => expect(source).toEqual({
        test: 'this test'
      }));
  });

  test('getTarget', () => {
    expect.assertions(1);
    schemePunkSource.getSchemePunkSourceTarget()
      .then((source) => expect(source)
        .toEqual('test'));
  });

  test('getCallPath', () => {
    expect.assertions(1);
    expect(schemePunkSource2.getCallPath())
      .toEqual('./');
  });

  test('getSource', () => {
    expect.assertions(1);
    return schemePunkSource.getSource()
      .then((source) => expect(source)
        .toEqual('this test'));
  });

  test('setHoldOversWithValues', async () => {
    expect.assertions(1);
    await schemePunkSource.setHoldOvers({
      src: {
        testive: 'test'
      },
      otherProp: 'otherValue',
      testive: {}
    });
    return schemePunkSource.getHoldOvers()
      .then((thing) => thing)
      .then((thing) => expect(thing)
        .toEqual({
          src: {
            testive: 'test'
          },
          otherProp: 'otherValue',
          testive: 'this test'
        }));
  });

  test('getHoldOversWithValues', async () => {
    expect.assertions(1);
    return schemePunkSource2.getHoldOvers()
      .then((thing) => expect(thing)
        .toEqual({
          src: {
            testive: 'test'
          },
          otherProp: 'otherValue',
          testive: 'this test'
        }));
  });

  test('getTemplateObject', () => {
    expect.assertions(1);
    return expect(schemePunkSource2.getTemplateObject()).toEqual(false);
  });

  test('setHoldOversWithoutValuesNoProp', async () => {
    expect.assertions(1);
    return schemePunkSource.getHoldOvers()
      .then((item) => expect(item).toEqual({}));
  });

  test('getHoldOversWithoutValues', async () => {
    expect.assertions(1);
    return schemePunkSource3.getHoldOvers()
      .then((item) => expect(item)
        .toEqual({
          otherProp: 'otherValue'
        }));
  });
});
