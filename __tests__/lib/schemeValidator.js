'use strict';

const {schemeValidator} = require('../../lib/schemeValidator');
const SchemePunkErrors = require('../../lib/SchemePunkErrors');

const tmpMocks = [];
let schemeRunnerScheme;
let testScheme;

describe('Scheme Runner Validation', async () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    schemeRunnerScheme = {
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
              plugin: 'activeSchemeSource'
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
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemeRunner validation', async () => {
    expect.assertions(1);
    expect(await schemeValidator({scheme: schemeRunnerScheme})).toMatchSnapshot();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
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
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Validation Error no Source', async () => {
    expect.assertions(2);
    testScheme = {
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data should have required property 'source'");
    }
  });
  it('Validation Error no Destination', async () => {
    expect.assertions(2);
    const testScheme1 = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      }
    };

    try {
      await schemeValidator({scheme: testScheme1, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data should have required property 'destination'");
    }
  });
  it('Validation Error no Transform', async () => {
    expect.assertions(2);
    const testScheme1 = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };

    try {
      await schemeValidator({scheme: testScheme1, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data should have required property 'transform'");
    }
  });
});


describe('OriginalSchemeSource Validation', async () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
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
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('OriginalSchemeSource No target', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
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
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data.source should have required property 'target', data.source should match \"then\" schema");
    }
  });
});

describe('ActiveSchemeSource Validation', async () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('OriginalSchemeSource No target', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data.source should have required property 'target', data.source should match \"then\" schema");
    }
  });
});

describe('ContingentSource Validation', async () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {
          testValue1: [
            {
              type: 'dynamic',
              path: 'newTest',
              target: 'testValue1',
            },
            {
              type: 'static',
              value: 'staticTest',
              path: 'type',
            },
            {
              type: 'holdOver',
              path: 'holdOverTest',
              holdover: {
                type: 'static',
                value: 'test2'
              },
            },
          ],
          defined: [
            {
              type: 'static',
              value: 'staticTestDefined',
              path: 'type',
            },
          ],
          undefined: [
            {
              type: 'static',
              value: 'staticTestUndefined',
              path: 'type',
            },
          ]
        }
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {
          defined: [
            {
              type: 'static',
              value: 'staticTestDefined',
              path: 'type',
            },
          ],
          undefined: [
            {
              type: 'static',
              value: 'staticTestUndefined',
              path: 'type',
            },
          ]
        }
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('ContigentSource No Contigencies', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {}
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.source.contingencies should NOT have fewer than 1 properties, data.source should match "then" schema');
    }
  });
  it('ContigentSource static bad props', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {
          defined: [
            {
              type: 'static',
              path: 'type'
            }
          ],
          undefined: [
            {
              type: 'static',
              value: 'staticTestUndefined'
            }
          ]
        }
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data.source.contingencies.defined[0] should have required property 'value', data.source.contingencies.defined[0] should match \"then\" schema, data.source.contingencies.undefined[0] should have required property 'path', data.source.contingencies.undefined[0] should match \"then\" schema, data.source should match \"then\" schema");
    }
  });
  it('ContigentSource dynamic bad props', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {
          testValue1: [
            {
              type: 'dynamic',
              path: 'newTest',
              target: {}
            },
            {
              type: 'dynamic',
              path: 'newTest',
            },
            {
              type: 'holdOver',
              path: 'holdOverTest',
              holdover: {
                type: 'static',
                value: 'test2'
              },
            },
          ],
          defined: [
            {
              type: 'static',
              value: 'staticTestDefined',
              path: 'type',
            },
          ],
          undefined: [
            {
              type: 'static',
              value: 'staticTestUndefined',
              path: 'type',
            },
          ]
        }
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data.source.contingencies['testValue1'][0].target should be string, data.source.contingencies['testValue1'][0] should match \"then\" schema, data.source.contingencies['testValue1'][1] should have required property 'target', data.source.contingencies['testValue1'][1] should match \"then\" schema, data.source should match \"then\" schema");
    }
  });
});
