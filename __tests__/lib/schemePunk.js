'use strict';

const SchemePunk = require('../../lib/schemePunk');
const SchemePunkErrors = require('../../lib/SchemePunkErrors');

let scheme;
let tmpMocks = [];
let data;

beforeEach(() => {
  tmpMocks.forEach((mock) => mock.mockRestore());
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
    templateObject: {test: 'test'},
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Scheme Runner', () => {
  test('Source error will throw.', () => {
    expect.assertions(4);
    const schemePunk = new SchemePunk(scheme);
    expect(schemePunk).toBeInstanceOf(SchemePunk);
    expect(schemePunk.templateObject).toEqual({test: 'test'});
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

describe('Scheme Runner throws', () => {
  test('Bad source throws', async () => {
    expect.assertions(2);
    const schemePunk = new SchemePunk({});

    try {
      await schemePunk.enhance();
    }
    catch (err) {
      expect(err).toBeInstanceOf(SchemePunkErrors);
      expect(err.message).toBe("SchemePunk Source failed: Cannot read property 'plugin' of undefined");
    }
  });
  test('Transform error will throw', async () => {
    expect.assertions(2);
    const dataObject = {originalScheme: data, activeScheme: {differentAttribute: null}, newScheme: {differentAttribute: null}};

    const tmpScheme = {...scheme};
    delete tmpScheme.transform;
    const schemePunk = new SchemePunk(tmpScheme);
    const dataImp = schemePunk.constructor.createScheme(dataObject);

    try {
      await schemePunk.enhance(dataImp);
    }
    catch (err) {
      expect(err).toBeInstanceOf(SchemePunkErrors);
      expect(err.message).toBe("SchemePunk Transform failed: Cannot read property 'plugin' of undefined");
    }
  });
  test('Destinationerror will throw', async () => {
    expect.assertions(2);
    const dataObject = {originalScheme: data, activeScheme: {differentAttribute: null}, newScheme: {differentAttribute: null}};

    const tmpScheme = {...scheme};
    delete tmpScheme.destination;
    const schemePunk = new SchemePunk(tmpScheme);
    const dataImp = schemePunk.constructor.createScheme(dataObject);

    try {
      await schemePunk.enhance(dataImp);
    }
    catch (err) {
      expect(err).toBeInstanceOf(SchemePunkErrors);
      expect(err.message).toBe("SchemePunk Destination failed: Cannot read property 'plugin' of undefined");
    }
  });
});
