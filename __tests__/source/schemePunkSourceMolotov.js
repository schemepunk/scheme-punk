'use strict';

jest.mock('../../lib/molotov', () => () => (new (class {
  mixSupers() {
    return this;
  }

  getMolotov() { // eslint-disable-line class-methods-use-this
    return {
      resolve() {
        return {
          source: {
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

const SchemePunkSourceBase = require('../../lib/source/schemePunkSource');
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

describe('Scheme Punk Source', () => {
  test('Class Construction', () => {
    expect.assertions(1);
    return SchemePunkSourceBase(options.source.plugin)
      .catch(e => expect(e.message).toEqual('A plugin named: originalSchemeSource, was indicated in a scheme but does not exist as a source plugin.'));
  });

  test('Class Construction', () => {
    expect.assertions(1);
    return SchemePunkSourceBase()
      .catch(e => expect(e.message).toEqual('No source plugin was indicated but the source super was not found.'));
  });
});
