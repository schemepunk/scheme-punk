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
    // Source origin is dependent on type. // For now we only have one type.
    // But eventually this behavior will be replaced by plugin behavior.
    this.schemePunkSourceOrigin = options.type === 'originalScheme' ? scheme.originalScheme : options.source;
    this.schemePunkSourceType = options.type;
    this.schemePunkSourceTarget = options.target;
    this.retrievedOrigin = {};
    this.schemePunkSource = {};

    this.setOrigin();
  }

  // This one will need to be modified for file retrieve.
  setOrigin() {
    // This will mostly be a pass through unless we have a file operation.
    this.retrievedOrigin = this.schemePunkSourceOrigin;
  }

  getOrigin() {
    return this.retrievedOrigin;
  }

  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }

  // This one will need to modified for target based operations.
  setSource() {
    this.schemePunkSource = _.get(this.getOrigin(), this.getSchemePunkSourceTarget());
  }

  // get target from retrievedOrigin
  getSource() {
    // This can be a pass through for variables but will generally entail Using
    // the target against the retrieved origin.
    return this.schemePunkSource;
  }
};
