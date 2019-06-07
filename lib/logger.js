'use strict';

const defaultLogger = require(
  'loglevel'
);

/**
 * Allows overriding or configuring the default logger.
 *
 * @param {object} getLoggerOptions
 *   An options object containing logging preferences.
 * @param {*} options.logger
 *   A logger that implements the following methods:
 *     [info, warn, debug, error, trace]
 * @param {object} options.defaultLoggerOptions
 *   Options for the default logger (loglevel)
 * @param {string} [options.defaultLoggerOptions.disableBelow=silent]
 *   Sets the error level for the default logger loglevel. By default
 *     all logging is turned off for the default.
 * @returns {*}
 *   The logger.
 */
function getLogger({logger, defaultLoggerOptions = {disableBelow: 'silent'}}) {
  if (logger) {
    return logger;
  }
  const ourLogger = defaultLogger;
  ourLogger.setLevel(defaultLoggerOptions.disableBelow);
  return ourLogger;
}

module.exports = getLogger;
