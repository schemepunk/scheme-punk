'use strict';

const Ajv = require('ajv');

const {
  schemeValidator,
  schemePunkSchema,
} = require('../../lib/schemeValidator');

describe('Scheme Runner Validation', async () => {
  test('Can pass in AJV Validator', async () => {
    expect.assertions(1);
    const testScheme = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource',
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-',
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination',
      },
    };
    const ajv = new Ajv({allErrors: true});
    const schemePunkValidator = ajv.compile(schemePunkSchema);
    const validators = {schemePunkValidator};
    return expect(await
    schemeValidator({
      scheme: testScheme,
      useValidator: 'schemePunkValidator',
      validators,
    })).toMatchSnapshot();
  });
});
