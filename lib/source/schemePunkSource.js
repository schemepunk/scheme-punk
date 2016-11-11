'use strict';

const _ = require('lodash');
// We can have complete schemas as sources
// We can have portions of a schema as a source
// We can have complete template files as sources
// We can have portions of files as sources
// We can have variables as sources.

// We have origins and targets within the source

// Have a source type - object, file, a passed variable.
// have a source  - could be a file or a variable name
// have a source target - '' == full, 'string' == target within an object

module.exports = class schemePunkSource {
  constructor(options, scheme) {
    // eslint-disable-next-line no-unused-vars
    this.scheme = scheme;
    this.setOrigin(this.scheme.originalScheme);
    this.setTarg(options.target);
  }
  /** Source origin is dependent on type. // For now we only have one type.
   * But eventually this behavior will be replaced by plugin behavior.
   */
  // Default behavior is to set the origin to whatever has been passed in source.
  // This is a likely contender for a mixin.
  setOrigin(originValue) {
    this.retrievedOrigin = originValue;
  }

  getOrigin() {
    return this.retrievedOrigin;
  }

  setTarget(targetValue) {
    this.schemePunkSourceTarget = targetValue;
  }

  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }
  // This is another likely contender for a mixin.
  // Default is to get a property on an object.
  getSource() {
    return _.get(this.getOrigin(), this.getSchemePunkSourceTarget());
  }
};
