'use strict';

const SchemePunkDestination = require('../../lib/supers/destination');

let tmpMocks = [];
let schemePunkDestination;
let schemePunkDestination2;
let schemePunkDestination3;
let holdOvers;

describe('Scheme Punk Destination Super', () => {
  beforeEach(async () => {
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
    holdOvers = {
      src: {
        testive: 'test'
      },
      otherProp: 'otherValue'
    };
    const holdOvers2 = {
      otherProp: 'otherValue'
    };

    const callPath = './';
    schemePunkDestination2 = new SchemePunkDestination();
    await schemePunkDestination2.init(options, '', scheme, holdOvers, callPath);
    schemePunkDestination3 = new SchemePunkDestination();
    await schemePunkDestination3.init(options, '', scheme, holdOvers2, callPath);
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

  test('getTemplateObject', () => {
    expect.assertions(1);
    return expect(schemePunkDestination2.getTemplateObject()).toEqual(false);
  });

  test('getSetDestination', () => {
    expect.assertions(1);
    schemePunkDestination.setDestination();
    return expect(schemePunkDestination.getDestination())
      .toEqual('activeScheme');
  });

  test('getCallPath', () => {
    expect.assertions(1);
    expect(schemePunkDestination2.getCallPath())
      .toEqual('./');
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
    schemePunkDestination.setHoldOvers(Promise.resolve('test'));
    return schemePunkDestination.getHoldOvers()
      .then(value => expect(value).toEqual('test'));
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

  test('destinationTargetAndPromote', async () => {
    expect.assertions(3);
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
          .toEqual({
            test: 'testValue'
          });
        expect(schemePunkDestination.getScheme()[schemePunkDestination.getDestination()][schemePunkDestination.getTarget()])
          .toEqual('testValue');
        schemePunkDestination.promoteActiveToNewScheme();
        expect(schemePunkDestination.getScheme().newScheme)
          .toEqual({
            test: 'testValue'
          });
      });
  });

  test('getHoldOversWithValues', () => {
    expect.assertions(1);
    schemePunkDestination.setHoldOvers(Promise.resolve(holdOvers));
    return schemePunkDestination.getHoldOvers()
      .then(value => expect(value).toEqual({
        otherProp: 'otherValue',
        src: {
          testive: 'test'
        }
      }));
  });
});
