'use strict';

const schemePunkTransformBase = require('./transform/schemePunkTransform');
const schemePunkSourceBase = require('./source/schemePunkSource');
const schemePunkDestinationBase = require('./destination/schemePunkDestination');

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
    return schemePunkSourceBase(this.options.source.plugin)
      .then((SchemeSource) => {
        const holdOvers = Object.assign({}, this.holdOvers);
        // Create a new schemePunk factory.
        const schemeSource = new SchemeSource();
        schemeSource.init(
          this.options.source,
          schemePunkScheme,
          holdOvers
        );
        this.setSchemeSource(schemeSource);
        return this.getSchemeSource().getSource();
      })
      .then(source => Promise.all([
        schemePunkTransformBase(this.options.transform.plugin),
        source
      ]))
      .then(([SchemeTransformer, source]) => {
        const transformer = new SchemeTransformer();
        transformer.init(
          this.options.transform,
          this.getSchemeSource().getHoldOvers()
        );
        return Promise.all([transformer, transformer.transform(source)]);
      })
      .then(([transformer]) => {
        // Get the transformed value.
        const transformedValue = transformer.getTransformedValue();

        // Get Scheme.
        const SchemeDestination = schemePunkDestinationBase(this.options.destination);
        const schemeDestination = new SchemeDestination(
          this.options.destination,
          transformedValue,
          schemePunkScheme,
          transformer.getHoldOvers()
        );
        return Promise.all([schemeDestination, schemeDestination.writeDestinationTarget()]);
      })
      .then(([destination]) => {
        destination.promoteActiveToNewScheme();
        return destination.getScheme();
      });
  }

  /**
   * set the schemeSource to the passed schemePunk source instance.
   *
   * @param {Object} source
   *   A schemepunk source object.
   */
  setSchemeSource(source) {
    this.schemeSource = source;
  }

  /**
   * Returns the schemePunk source instnace for this schemePunk.
   *
   * @returns {object} source
   *   A source schemePunk instance.
   */
  getSchemeSource() {
    return this.schemeSource;
  }
};
