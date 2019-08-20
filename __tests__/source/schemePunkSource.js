'use strict';

const fs = require('fs-extra');

const SchemePunkSourceBase = require('../../lib/source/schemePunkSource');
const options = require('./../__helpers__/schemePunkTestOptions');

const Molotov = require('../../lib/molotov');

const schemePunkScheme = fs.readJSONSync('./__tests__/__mocks__/schemePunkMockScheme.json');
const schemePart = fs.readJSONSync('./__tests__/__mocks__/sourceSchema.json');

let tmpMocks = [];

class sourceBase {
  init(options, scheme, holdOvers) { // eslint-disable-line no-shadow
    super.init(options, scheme, holdOvers);
    this.setTarget();
  }

  getSchemePunkSourceTarget() {} // eslint-disable-line class-methods-use-this

  setOrigin() {} // eslint-disable-line class-methods-use-this

  getOrigin() {} // eslint-disable-line class-methods-use-this

  getHoldOvers() {} // eslint-disable-line class-methods-use-this
}

beforeEach(() => {
  tmpMocks.forEach((mock) => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Scheme Punk Source', () => {
  const scheme = {
    originalScheme: schemePunkScheme
  };

  const optionsNoPlugs = {
    source: {
      target: 'properties',
      origin: {
        properties: ['test1', 'test2', 'test3']
      }
    },
    holdOvers: {
      test: 'test'
    }
  };

  test('Class Construction', () => {
    let testClass;
    expect.assertions(1);
    return SchemePunkSourceBase(options.source.plugin)
      .then((SchemeSource) => {
        testClass = SchemeSource;
        const schemeSource = new SchemeSource();
        schemeSource.init(options.source, scheme, {});
        return schemeSource;
      })
      .then((schemeSource) => expect(schemeSource)
        .toBeInstanceOf(testClass));
  });

  test('Class Construction no super setTarget', () => {
    let testClass;
    expect.assertions(1);
    return SchemePunkSourceBase(options.source.plugin)
      .then((SchemeSource) => {
        testClass = SchemeSource;
        const schemeSource = new SchemeSource(sourceBase);
        schemeSource.init(options.source, scheme, {});
        return schemeSource;
      })
      .then((schemeSource) => expect(schemeSource)
        .toBeInstanceOf(testClass));
  });

  test('Class Construction No Plugs', () => {
    let testClass;
    expect.assertions(1);
    return SchemePunkSourceBase()
      .then((SchemeSource) => {
        testClass = SchemeSource;
        const schemeSource = new SchemeSource();
        schemeSource.init(
          optionsNoPlugs.source,
          schemePunkScheme, {
            test: 'test'
          }
        );
        return expect(schemeSource)
          .toBeInstanceOf(testClass);
      });
  });

  test('SchemeBase get Source', () => {
    expect.assertions(1);
    return SchemePunkSourceBase(options.source.plugin)
      .then((SchemeSource) => {
        const schemeSource = new SchemeSource();
        schemeSource.init(options.source, scheme, {});
        return schemeSource.getSource();
      })
      .then((source) => {
        expect(source)
          .toEqual(schemePart);
      });
  });

  test('Base super call', () => {
    expect.assertions(1);
    return SchemePunkSourceBase()
      .then((SchemeSource) => {
        const schemeSource = new SchemeSource();
        schemeSource.init(
          optionsNoPlugs.source,
          schemePunkScheme, {
            test: 'test'
          }
        );
        return schemeSource.getSource();
      })
      .then((source) => expect(source)
        .toEqual([
          'test1',
          'test2',
          'test3'
        ]));
  });

  test('Get Hold overs', () => {
    expect.assertions(1);
    return SchemePunkSourceBase(options.source.plugin)
      .then((SchemeSource) => {
        const schemeSource = new SchemeSource();
        schemeSource.init(options.source, scheme, {});
        return schemeSource.getHoldOvers();
      })
      .then((res) => expect(res).toEqual({}));
  });

  test('Set Holdovers', () => {
    expect.assertions(1);
    return SchemePunkSourceBase(options.source.plugin)
      .then((SchemeSource) => {
        const schemeSource = new SchemeSource();
        schemeSource.init(options.source, scheme, {});
        schemeSource.setHoldOvers({
          tough: 'test'
        });
        return schemeSource;
      })
      .then((schemeSource) => schemeSource.getHoldOvers())
      .then((holdOvers) => expect(holdOvers)
        .toEqual({
          tough: 'test'
        }));
  });

  test('Get Holdovers super call', () => {
    expect.assertions(1);
    return SchemePunkSourceBase()
      .then((SchemeSource) => {
        const schemeSource = new SchemeSource();
        schemeSource.init(
          optionsNoPlugs.source,
          schemePunkScheme, {
            test: 'test'
          }
        );
        return schemeSource.getHoldOvers();
      })
      .then((res) => expect(res).toEqual({
        test: 'test'
      }));
  });
});

describe('Molotov coverage', () => {
  test('Class Construction', () => {
    expect.assertions(1);
    const molotov = Molotov();
    expect(molotov.getNameSpace()).toBe('schemePunk');
  });
});
