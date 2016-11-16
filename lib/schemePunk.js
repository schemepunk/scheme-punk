'use strict';

const schemePunkTransformBase = require('./transform/schemePunkTransformBase');
const schemePunkSourceBase = require('./source/schemePunkSourceBase');
const schemePunkDestinationBase = require('./destination/schemePunkDestinationBase');

module.exports = class schemePunk {
  constructor(options) {
    this.options = options;
  }

  /**
   * Creates a scheme with original, active, and new schemes.
   */
  static createScheme(schemeOptions = {}) {
    // Set Defaults in case options is empty.
    const scheme = {
      originalScheme: null,
      activeScheme: null,
      newScheme: null
    };
    // Merge in options object which will have originalScheme, activeScheme,
    // and newScheme.
    return Object.assign(scheme, schemeOptions);
  }

  enhance(schemePunkScheme) {
    return new Promise((resolve, reject) => {
      try {
        // Create a new schemePunk factory.
        const SchemeSource = schemePunkSourceBase(this.options.source, schemePunkScheme);
        const schemeSource = new SchemeSource(this.options.source, schemePunkScheme);
        // Get the source.
        const source = schemeSource.getSource();

        // Create the transformation mixin assocatied with this transform key.
        const SchemeTransformer = schemePunkTransformBase(this.options.transform);
        // Here is an instance of schemeTransformer.
        const atransformer = new SchemeTransformer();
        // Run the transformer
        atransformer.transform(source);
        // Get the transformed value.
        const bit = atransformer.getTransformedValue();

        // Get Scheme.
        const SchemeDestination = schemePunkDestinationBase(this.options.destination);
        const schemeDestination = new SchemeDestination(this.options.destination, bit, schemePunkScheme);
        schemeDestination.writeDestinationTarget();
        schemeDestination.promoteActiveToNewScheme();

        resolve(schemeDestination.getScheme());
        // if not return reject.
      }
      catch (err) {
        reject(err);
      }
    });
  }
};
