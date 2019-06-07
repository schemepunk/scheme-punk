'use strict';

const Ajv = require('ajv');

const ajv = new Ajv({allErrors: true});

const getLogger = require('./logger');
const {
  SCHEME_PUNK_INVALID_SCHEME_INSTRUCTIONS
} = require('./_errors');
const SchemePunkErrors = require('./SchemePunkErrors');

// For now using a static scheme - will want to approach validation
// dynamically from the molotov built plugins and supers.
const schemePunkSchema = require('./schemas/schemePunkSchema.json');
const schemeRunnerSchema = require('./schemas/schemeRunnerSchema.json');

const preCompiledValidators = {
  schemePunkValidator: ajv.compile(schemePunkSchema),
  schemeRunnerValidator: ajv.compile(schemeRunnerSchema)
};

/**
   * Determine whether a scheme is in the correct format.
   *
   * @param {Object} scheme
   *   A Scheme punk scheme you wish to validate.
   * @returns {boolean}
   *   Validates a scheme agains the json schema definition for schems.
   *     Returns true for a valid scheme.
   */
async function schemeValidator({
  scheme,
  useValidator = 'schemeRunnerValidator',
  validators,
  loggerOptions = {}
}) {
  let ajvValidators = validators;
  if (!validators) {
    ajvValidators = preCompiledValidators;
  }
  const logger = getLogger(loggerOptions);

  logger.info('Validating scheme');
  const validate = ajvValidators[useValidator];
  const validScheme = validate(scheme);
  if (!validScheme) {
    const msg = ajv.errorsText(validate.errors);
    logger.error(`Scheme Validation errors: ${msg}`);
    throw new SchemePunkErrors(SCHEME_PUNK_INVALID_SCHEME_INSTRUCTIONS, msg);
  }
  logger.info('This is a valid scheme.');
  return scheme;
}

module.exports = {schemeValidator, schemePunkSchema, schemeRunnerSchema};
