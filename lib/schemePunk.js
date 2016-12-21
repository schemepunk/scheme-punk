'use strict';

const schemePunkTransformBase = require('./transform/schemePunkTransformBase');
const schemePunkSourceBase = require('./source/schemePunkSourceBase');
const schemePunkDestinationBase = require('./destination/schemePunkDestinationBase');

module.exports = class schemePunk {
  constructor(options) {
    this.options = options;
  }

  /**
   * static createScheme function creates a scheme object.
   *
   * @param  obj schemeOptions
   *  Takes a schemeOptions object consisting of original, active and new
   *  schemes.
   * @return schemeOptions
   *   Returns a scheme object.                    description
   */
  static createScheme(schemeOptions) {
    if (typeof schemeOptions === 'undefined') {
      schemeOptions = {};
    }
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

  /**
   * Enhance a scheme source with a transformation into a destination.
   * Returns a promise.
   *
   * @param  object schemePunkScheme
   *   A schemePunkScheme object.
   *
   */
  enhance(schemePunkScheme) {
    return new Promise((resolve, reject) => {
      try {
        // Create a new schemePunk factory.
        const SchemeSource = schemePunkSourceBase(
          this.options.source,
          schemePunkScheme
        );
        const schemeSource = new SchemeSource(
          this.options.source,
          schemePunkScheme
        );
        // Get the source.
        const source = schemeSource.getSource();

        // Create the transformation mixin assocatied with this transform key.
        const SchemeTransformer = schemePunkTransformBase(
          this.options.transform
        );
        // Here is an instance of schemeTransformer.
        const atransformer = new SchemeTransformer();
        // Run the transformer
        atransformer.transform(source);
        // Get the transformed value.
        const bit = atransformer.getTransformedValue();

        // Get Scheme.
        const SchemeDestination = schemePunkDestinationBase(
          this.options.destination
        );
        const schemeDestination = new SchemeDestination(
          this.options.destination,
          bit,
          schemePunkScheme
        );
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
