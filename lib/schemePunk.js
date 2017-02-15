'use strict';

const schemePunkTransformBase = require('./transform/schemePunkTransformBase');
const schemePunkSourceBase = require('./source/schemePunkSourceBase');
const schemePunkDestinationBase = require('./destination/schemePunkDestinationBase');

module.exports = class schemePunk {
  constructor(options) {
    this.options = options;
    this.holdOvers = {};
    if (options.holdOvers) {
      this.holdOvers = Object.assign({}, options.holdOvers);
    }
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
    let tmpSchemeOptions = {};
    if (typeof schemeOptions !== 'undefined') {
      tmpSchemeOptions = schemeOptions;
    }
    // Set Defaults in case options is empty.
    const scheme = {
      originalScheme: null,
      activeScheme: null,
      newScheme: null
    };
    // Merge in options object which will have originalScheme, activeScheme,
    // and newScheme.
    return Object.assign(scheme, tmpSchemeOptions);
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
        const holdOvers = Object.assign({}, this.holdOvers);
        // Create a new schemePunk factory.
        const SchemeSource = schemePunkSourceBase(
          this.options.source,
          schemePunkScheme
        );
        const schemeSource = new SchemeSource(
          this.options.source,
          schemePunkScheme,
          holdOvers
        );
        // Get the source.
        const source = schemeSource.getSource();

        // Create the transformation mixin assocatied with this transform key.
        const SchemeTransformer = schemePunkTransformBase(
          this.options.transform,
          schemeSource.getHoldOvers()
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
          schemePunkScheme,
          atransformer.getHoldOvers()
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
