'use strict';

jest.mock('../../lib/molotov', () => () => (new (class {
  mixSupers() {
    return this;
  }

  getMolotov() { // eslint-disable-line class-methods-use-this
    return {
      resolve() {
        return {
          destination: {
            pluginName: undefined,
          }
        };
      },
      getSupers() {
        return {
          destination: undefined
        };
      },
    };
  }
})()));

const Molotov = require('../../lib/molotov'); // eslint-disable-line

const SchemePunkDestinationBase = require('../../lib/destination/schemePunkDestination');

let tmpMocks = [];

beforeEach(() => {
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Scheme Punk Destination', () => {
  test('Class Construction no plugin fail.', () => {
    expect.assertions(1);
    return SchemePunkDestinationBase('concatIntoDestination')
      .catch(e => expect(e.message).toEqual('A destination plugin named: concatIntoDestination, was called but did not exist in the destination Object.'));
  });
});

describe('Scheme Punk Destination 2', () => {
  test('Class Construction no supers fail.', () => {
    expect.assertions(1);
    return SchemePunkDestinationBase()
      .catch(e => expect(e.message).toEqual('Destination was called with no plugins but the super did not exist in the supers Object.'));
  });
});
