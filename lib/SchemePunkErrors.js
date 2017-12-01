'use strict';

/**
 * @class
 * A custom error class which has a `code` property that
 * should align with schemePunk errors defined in _errors.js
 */
class SchemePunkError extends Error {
  /**
   *
   * @param {String} code
   *   The error code which will correspond to ./_errors.js
   * @param {*} args
   *   Any series of error args.
   */
  constructor(code, ...args) {
    const [message, ...rest] = args;
    super(message || code, ...rest);

    Error.captureStackTrace(this, SchemePunkError);

    this.code = code;
  }
}

module.exports = SchemePunkError;
