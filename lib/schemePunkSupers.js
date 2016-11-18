'use strict';

/**
 * This script loads in our default super classes for schemePunk sources,
 * destinations, and transforms. A single override super can be specified
 * for each component of schemePunk. If overrides have been specified in
 * config we will override our default supers with them to be used in
 * mixin construction.
 */
let override;
// Prevent config warnings if this module is the only use of config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
// Use require directory to require all of our default plugins.
const config = require('config');
const tryRequire = require('try-require');
const path = require('path');
const _ = require('lodash');

// These are our default super classes.
const schemePunkTransformSuperDefault = require('./transform/schemePunkTransform');
const schemePunkSourceSuperDefault = require('./source/schemePunkSource');
const schemePunkDestinationSuperDefault = require('./destination/schemePunkDestination');

// Set our default super classes in an object for processing.
const superConfig = {
  transform: schemePunkTransformSuperDefault,
  source: schemePunkSourceSuperDefault,
  destination: schemePunkDestinationSuperDefault
};

const configTemp = {};

  // We will now look in config for any overides.
Object.keys(superConfig).forEach((currentValue) => {
  if (_.has(config, `schemePunk.${currentValue}.superOverride`)) {
    // We do have an overide, we will set the path.
    override = config.schemePunk[currentValue].superOverride;
    // Now let's try and require it.
    // eslint-disable-next-line import/no-dynamic-require
    configTemp[currentValue] = tryRequire(path.join(__dirname, override));
  }
}, this);

// Any failed tryRequire will be null so we clean out any nulls before we merge.
const result = _.omitBy(configTemp, _.isNil);

// And now we merge in result to superConfig overwriting any defaults.
Object.assign(superConfig, result);

module.exports = superConfig;
