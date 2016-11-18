'use strict';

/**
 * This plugin loader attempts to merge in configuration entities for
 * schemePunk tranformations, sources, and destinations if they exist in
 * a npm module config compatible configuration. It then attempts to merge
 * those overrides over default configuration for this module and its plugins.
 *
 * This happens in require time. It also sets up the pattern that any
 * configuration override behavior will belong in the application
 * config space rather than other modules. If additional plugin supplying
 * modules are to be included that will need to happen in the app config.
 */
let override;
// Prevent config warnings if this module is the only use of config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
// Use require directory to require all of our default plugins.
const config = require('config');
const tryRequire = require('try-require');
const path = require('path');
const _ = require('lodash');

const schemePunkTransformSuperDefault = require('./transform/schemePunkTransform');
const schemePunkSourceSuperDefault = require('./source/schemePunkSource');
const schemePunkDestinationSuperDefault = require('./destination/schemePunkDestination');

// Set our default super classes.
const superConfig = {
  transform: schemePunkTransformSuperDefault,
  source: schemePunkSourceSuperDefault,
  destination: schemePunkDestinationSuperDefault
};

const configTemp = {};

  // Check for super overrides and set superConfig for use in mixin extends.
Object.keys(superConfig).forEach((currentValue) => {
  if (_.has(config, `schemePunk.${currentValue}.superOverride`)) {
    override = config.schemePunk[currentValue].superOverride;
    // eslint-disable-next-line import/no-dynamic-require
    configTemp[currentValue] = tryRequire(path.join(__dirname, override));
  }
}, this);

const result = _.omitBy(configTemp, _.isNil);

Object.assign(superConfig, result);

module.exports = superConfig;
