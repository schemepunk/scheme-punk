'use strict';

// plugin problem
module.exports = {
  NO_PLUGIN: 'plugin not found',
  BAD_SCHEMES: 'There was a problem with the schemes provided to the schemeRunner.',
  FAILED_SOURCE_PLUGIN: 'failed source plugin',
  SCHEME_PUNK_INVALID_SCHEME_INSTRUCTIONS: 'The scheme is invalid',
  MALFORMED_OR_NO_DATA: 'No data was provided to schemePunk Runner to run through scheme', // eslint-disable-line max-len
  SCHEME_PUNK_SOURCE_FAILURE: 'SchemePunk Source failed',
  SCHEME_PUNK_TRANSFORM_FAILURE: 'SchemePunk Transform failed',
  SCHEME_PUNK_DESTINATION_FAILURE: 'SchemePunk Destination failed',
  SCHEME_RUNNER_NOT_INITIALIZED: 'Could not initialize the scheme runner',
  SCHEME_RUNNER_CANT_RUN_SCHEME: 'Scheme runner failed to run a scheme'
};
