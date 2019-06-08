'use strict';

const _ = require('lodash');

const SchemeRunner = require('../../lib/SchemeRunner');
const SchemePunkErrors = require('../../lib/SchemePunkErrors');


let tmpMocks = [];
let data;
let schemeArray;
let molotovOptions;

beforeEach(() => {
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
  data = {test: 'testValue'};
  schemeArray = {
    arbitraryNameForThisScheme: [
      [
        {
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
          }
        }
      ],
      [
        {
          source: {
            target: 'test',
            plugin: 'originalSchemeSource'
          },
          transform: {
            plugin: 'appendValuesAdapter',
            sourceAppend: '-'
          },
          destination: {
            target: 'test',
            plugin: 'concatIntoDestination'
          }
        }
      ]
    ],
  };
  molotovOptions = {
    overrides: {},
    cocktailClasses: []
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Scheme Runner', () => {
  test('Basic init and scheme running', () => {
    expect.assertions(5);
    const schemeRunner = new SchemeRunner();
    expect(schemeRunner).toBeInstanceOf(SchemeRunner);
    return schemeRunner.init(_.cloneDeep(data), _.cloneDeep(schemeArray), _.cloneDeep(molotovOptions))
      .then((sr) => {
        expect(sr.getData()).toMatchSnapshot();
        expect(sr.getSchemes()).toMatchSnapshot();
        expect(sr.getMolotovOptions()).toMatchSnapshot();
        return schemeRunner.runScheme();
      })
      .then(item => expect(item).toEqual({
        test: [
          '+testValue',
          'testValue-'
        ]
      }));
  });
});

describe('Scheme Runner Error Cases', () => {
  test('No data', () => {
    expect.assertions(2);
    const schemeRunner = new SchemeRunner();
    return schemeRunner.init(null, _.cloneDeep(schemeArray), _.cloneDeep(molotovOptions))
      .catch((e) => {
        expect(e).toBeInstanceOf(SchemePunkErrors);
        expect(e.message).toBe('Could not initialize the scheme runner: No data was provided to schemePunk Runner to run through scheme');
      });
  });
  test('No Scheme', () => {
    expect.assertions(1);
    const schemeRunner = new SchemeRunner();
    return schemeRunner.init(_.cloneDeep(data), undefined, _.cloneDeep(molotovOptions))
      .catch(e => expect(e).toBeInstanceOf(SchemePunkErrors));
  });

  test('Basic init and scheme running Error.', async () => {
    expect.assertions(3);
    const schemeRunner = new SchemeRunner();
    expect(schemeRunner).toBeInstanceOf(SchemeRunner);
    const badScheme = _.cloneDeep(schemeArray);
    badScheme.arbitraryNameForThisScheme.push(
      {
        source: {
          target: null,
          plugin: 'originala'
        },
        transform: {
          target: 'test',
          value: 'test'
        },
        destination: {
          target: 'test',
          plugin: 'concatIntoDestination'
        }
      }
    );
    try {
      await schemeRunner.init(_.cloneDeep(data), _.cloneDeep(badScheme), _.cloneDeep(molotovOptions));
      await schemeRunner.runScheme();
    }
    catch (e) {
      expect(e).toBeInstanceOf(SchemePunkErrors);
      expect(e.message).toBe('Could not initialize the scheme runner: The scheme is invalid');
    }
  });
});


describe('Scheme Runner Coverage', () => {
  test('Basic init and scheme running', () => {
    expect.assertions(5);
    const schemeRunner = new SchemeRunner();
    expect(schemeRunner).toBeInstanceOf(SchemeRunner);
    const tmpData = {
      originalScheme: _.cloneDeep(data),
      activeScheme: _.cloneDeep(data),
      newScheme: _.cloneDeep(data)
    };
    return schemeRunner.init(tmpData, _.cloneDeep(schemeArray), _.cloneDeep(molotovOptions))
      .then((sr) => {
        expect(sr.getData()).toMatchSnapshot();
        expect(sr.getSchemes()).toMatchSnapshot();
        expect(sr.getMolotovOptions()).toMatchSnapshot();
        return schemeRunner.runScheme();
      })
      .then(item => expect(item).toEqual({
        test: [
          '+testValue',
          'testValue-'
        ]
      }));
  });
});
