'use strict';

const SchemePunkDestination = require('../../lib/supers/destination');

let tmpMocks = [];
let schemePunkDestination;
let schemePunkDestination2;
let schemePunkDestination3;

describe('Scheme Punk Destination Super', () => {
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
    schemePunkDestination = new SchemePunkDestination();
    // schemePunkDestination.init(options, scheme, {});
    const holdOvers = {
      src: {
        testive: 'test'
      },
      otherProp: 'otherValue'
    };
    const holdOvers2 = {
      otherProp: 'otherValue'
    };

    schemePunkDestination2 = new SchemePunkDestination();
    schemePunkDestination2.init(options, scheme, holdOvers);
    schemePunkDestination3 = new SchemePunkDestination();
    schemePunkDestination3.init(options, scheme, holdOvers2);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('getSetTarget', () => {
    expect.assertions(1);
    schemePunkDestination.setTarget('test');
    return expect(schemePunkDestination.getTarget())
      .toEqual('test');
  });

  test('getSetDestination', () => {
    expect.assertions(1);
    schemePunkDestination.setDestination();
    return expect(schemePunkDestination.getDestination())
      .toEqual('activeScheme');
  });

  // set/get value
  test('getSetValue', () => {
    expect.assertions(1);
    schemePunkDestination.setValue('test');
    return expect(schemePunkDestination.getValue())
      .toEqual('test');
  });

  // set/get value
  test('getSetHoldovers', () => {
    expect.assertions(1);
    schemePunkDestination.setHoldOvers('test');
    return expect(schemePunkDestination.getHoldOvers())
      .toEqual('test');
  });

  // validateDestinationTarget
  test('validateDestinationTarget has target', () => {
    expect.assertions(1);
    schemePunkDestination.scheme = {
      activeScheme: {
        test: 'tester'
      }
    };
    schemePunkDestination.setTarget('test');
    schemePunkDestination.setDestination();

    return expect(schemePunkDestination.validateDestinationTarget())
      .toBeTruthy();
  });

  test('writeDestinationTarget', () => {
    expect.assertions(2);
    schemePunkDestination.scheme = {
      activeScheme: {
        test: 'tester'
      }
    };
    schemePunkDestination.setTarget('test');
    schemePunkDestination.setDestination();
    schemePunkDestination.setValue('testValue');
    return schemePunkDestination.writeDestinationTarget()
      .then((value) => {
        expect(value)
          .toEqual({test: 'testValue'});
        expect(schemePunkDestination.getScheme()[schemePunkDestination.getDestination()][schemePunkDestination.getTarget()])
          .toEqual('testValue');
      });
  });


  // promote active test.

  test('getHoldOversWithValues', () => {
    expect.assertions(1);
    return schemePunkSource2.getHoldOvers()
      .then(thing => expect(thing)
        .toEqual({
          src: {
            testive: 'test'
          },
          otherProp: 'otherValue',
          testive: 'this test'
        }));
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
        .toEqual({
          otherProp: 'otherValue'
        }));
  });
});