'use strict';

const schemePunkTransformBase = require('./transform/schemePunkTransform');
const schemePunkSourceBase = require('./source/schemePunkSource');
const schemePunkDestinationBase = require('./destination/schemePunkDestination');

module.exports = class schemePunk {
  constructor(options, molotovConfig = {config: {}, dynamicPlugins: {}}) {
    this.options = options;
    this.holdOvers = {};
    this.callPath = __dirname;
    this.molotovConfig = molotovConfig;
    if (options.holdOvers) {
      this.holdOvers = Object.assign({}, options.holdOvers);
    }
    if (options.callPath) {
      this.callPath = options.callPath;
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
    return schemePunkSourceBase(this.options.source.plugin, this.molotovConfig)
      .then((SchemeSource) => {
        const holdOvers = Object.assign({}, this.holdOvers);
        // Create a new schemePunk factory.
        const schemeSource = new SchemeSource();
        return schemeSource.init(
          this.options.source,
          schemePunkScheme,
          holdOvers,
          this.callPath
        );
      })
      .then((source) => {
        this.setSchemeSource(source);
        return this.getSchemeSource().getSource();
      })
      .then(source => Promise.all([
        schemePunkTransformBase(this.options.transform.plugin, this.molotovConfig),
        source
      ]))
      .then(([SchemeTransformer, source]) => {
        const transformer = new SchemeTransformer();
        return Promise.all(transformer.init(
          this.options.transform,
          this.getSchemeSource().getHoldOvers(),
          this.callPath
        ), source);
      })
      .then((transformer, source) => transformer.transform(source)
        .then(() => transformer))
      .then((transformer) => {
        // Get the transformed value.
        const transformedValue = transformer.getTransformedValue();

        // Get Scheme.
        const SchemeDestination = schemePunkDestinationBase(this.options.destination, this.molotovConfig); // eslint-disable-line max-len
        const schemeDestination = new SchemeDestination();
        return schemeDestination.init(
          this.options.destination,
          transformedValue,
          schemePunkScheme,
          transformer.getHoldOvers(),
          this.callPath
        );
      })
      .then(schemeDestination => schemeDestination.writeDestinationTarget()
        .then(() => schemeDestination))
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
