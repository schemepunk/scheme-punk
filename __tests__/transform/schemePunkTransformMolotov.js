'use strict';

jest.mock('../../lib/molotov', () => () => (new (class {
  mixSupers() {
    return this;
  }

  getMolotov() { // eslint-disable-line class-methods-use-this
    return {
      resolve() {
        return {
          transform: {
            pluginName: undefined,
          }
        };
      },
      getSupers() {
        return {
          source: undefined
        };
      },
    };
  }
})()));

const Molotov = require('../../lib/molotov'); // eslint-disable-line

const SchemePunkTransformBase = require('../../lib/transform/schemePunkTransform');
const options = require('./../__helpers__/schemePunkTestOptions');

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

describe('Scheme Punk Transform', () => {
  test('Class Construction', () => {
    expect.assertions(1);
    return SchemePunkTransformBase(options.transform.plugin)
      .catch(e => expect(e.message).toEqual('A tranform plugin named: objectKeysTransform, was called but did not exist in the transform Object.'));
  });

  test('Class Construction', () => {
    expect.assertions(1);
    return SchemePunkTransformBase()
      .catch(e => expect(e.message).toEqual('Transform was called with no plugins but the super did not exist in the supers Object.'));
  });
});
