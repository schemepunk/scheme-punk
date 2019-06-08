'use strict';

const _ = require('lodash');

const SchemeRunner = require('../../lib/SchemeRunner');

let tmpMocks = [];
let schemeArray;
let molotovOptions;


describe('Scheme Runner Throw', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();

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
  test('SchemeRunner Throw', async () => {
    expect.assertions(1);
    const schemeRunner = new SchemeRunner();

    try {
      await schemeRunner.init(new Error(), _.cloneDeep(schemeArray), _.cloneDeep(molotovOptions));
      jest.spyOn(schemeRunner, 'setData').mockImplementation(() => {
        throw new Error();
      });
      await schemeRunner.runScheme();
    }
    catch (error) {
      expect(error.message).toBe('Scheme runner failed to run a scheme: SchemePunk Transform failed: Could not find a type for value undefined in Transform type adapter.');
    }
  });
});
