'use strict';

const SchemePunk = require('../../lib/schemePunk');

let scheme;
let tmpMocks = [];
let data;

beforeEach(() => {
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
  data = {test: 'testValue'};
  scheme = {
    source: {
      target: 'test',
      plugin: 'originalSchemeSource'
    },
    transform: {
      plugin: 'prependValuesAdapter',
      sourcePrepend: '+'
    },
    destination: {
      target: 'test'
    },
    holdOvers: {
      src: {
        testthing: 'test'
      }
    },
    callPath: __dirname,
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Scheme Runner', () => {
  test('Basic init and scheme running', () => {
    expect.assertions(3);
    const schemePunk = new SchemePunk(scheme);
    expect(schemePunk).toBeInstanceOf(SchemePunk);
    const dataObject = {originalScheme: data, activeScheme: {differentAttribute: null}, newScheme: {differentAttribute: null}};
    expect(schemePunk.constructor.createScheme(dataObject)).toEqual({
      activeScheme: {
        differentAttribute: null
      },
      newScheme: {
        differentAttribute: null
      },
      originalScheme: {
        test: 'testValue'
      }
    });
    expect(schemePunk.constructor.createScheme()).toEqual({
      activeScheme: null,
      newScheme: null,
      originalScheme: null
    });
  });
});
