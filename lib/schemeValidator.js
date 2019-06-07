'use strict';

const Ajv = require('ajv');
const getLogger = require('./logger');
const SchemePunkErrors = require('./SchemePunkErrors');

// For now using a static scheme - will want to approach validation
// dynamically from the molotov built plugins and supers.
const schemePunkSchema = require('./schemas/schemePunkSchema.json');

/**
   * Determine whether a scheme is in the correct format.
   *
   * @param {Objec} scheme
   *   A Scheme punk scheme you wish to validate.
   * @returns {boolean}
   *   Validates a scheme agains the json schema definition for schems.
   *     Returns true for a valid scheme.
   */
async function validateScheme(scheme, ajvOptions = {allErrors: true}, loggerOptions = {}) {
  const logger = getLogger(loggerOptions);
  let validate;
  let validScheme;

  const ajv = await new Ajv(ajvOptions);
  try {
    logger.info('Compiling scheme punk schema');
    validate = await ajv.compile(schemePunkSchema);
    logger.info('Validating scheme');
    validScheme = validate(scheme);
    logger.info('This is a valid scheme.');
    return validScheme;
  }
  catch (err) {
    if (!(err instanceof Ajv.ValidationError)) throw SchemePunkErrors(err.message);
    // data is invalid
    const msg = err.errors.message;
    logger.error('Scheme Validation errors:', msg);
    throw new SchemePunkErrors(`Invalid Scheme: ${msg}`, err.errors);
  }
}

module.exports = validateScheme;
