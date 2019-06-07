'use strict';

const getLogger = require('./logger');
const schemePunkTransformBase = require('./transform/schemePunkTransform');
const schemePunkSourceBase = require('./source/schemePunkSource');
const schemePunkDestinationBase = require('./destination/schemePunkDestination');

module.exports = class schemePunk {
  constructor(options, molotovConfig = {overrides: {}, cocktailClasses: []}, loggerOptions = {}) {
    this.options = options;
    this.logger = getLogger(loggerOptions);
    this.holdOvers = {};
    this.callPath = __dirname;
    this.molotovConfig = molotovConfig;
    if (options.holdOvers) {
      this.holdOvers = Object.assign({}, options.holdOvers);
    }
    if (options.callPath) {
      this.callPath = options.callPath;
    }
    if (options.templateObject) {
      this.templateObject = options.templateObject;
    }
  }

  /**
   * static createScheme function creates a scheme object.
   *
   * @param  obj schemeOptions
   *  Takes a schemeOptions object consisting of original, active and new
   *  schemes.
   * @return schemeOptions
   *   Returns a scheme object.
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
  async enhance(schemePunkScheme) {
    this.logger.info('Getting schemePunk Source Base');
    // Create a new schemePunk source factory.
    const SchemeSource = await schemePunkSourceBase(this.options.source.plugin, this.molotovConfig);
    // Retrieve any holdOvers from the source.
    const holdOvers = Object.assign({}, this.holdOvers);
    // Create an instance of the source worker.
    const schemeSource = new SchemeSource();
    // Initialize.
    const source = await schemeSource.init(
      this.options.source,
      schemePunkScheme,
      holdOvers,
      this.callPath,
      this.templateObject
    );
    // Now set the source using the indicated plugins in the options.source.
    this.setSchemeSource(source);
    // Gather our source from our mixed-in source class.
    const retrievedSource = await this.getSchemeSource().getSource();

    // Create a new schemePunk transformer factory.
    const SchemeTransformer = await schemePunkTransformBase(
      this.options.transform.plugin,
      this.molotovConfig
    );
    // Retrieve any holdovers from the mixed-in source.
    const sourceHoldOvers = await this.getSchemeSource().getHoldOvers();
    // Instantiate an instance of the transform worker.
    const transformer = await new SchemeTransformer();
    // Initialize.
    await transformer.init(
      this.options.transform,
      sourceHoldOvers,
      this.callPath,
      this.templateObject
    );
    // transform values.
    await transformer.transform(retrievedSource);
    // Retrieve transformed values;
    const transformedValue = await transformer.getTransformedValue();

    // Create a destination factory.
    const SchemeDestination = await schemePunkDestinationBase(
      this.options.destination.plugin,
      this.molotovConfig
    );

    // Create an instance of the destination class;
    const schemeDestination = new SchemeDestination();
    // Get any holdovers from the mixed-in transformer.
    const transformerHoldOvers = await transformer.getHoldOvers();
    // Initialize the destination class.
    await schemeDestination.init(
      this.options.destination,
      transformedValue,
      schemePunkScheme,
      transformerHoldOvers,
      this.callPath,
      this.templateObject
    );
    // Write to the targets.
    await schemeDestination.writeDestinationTarget();
    // Promote the scheme.
    await schemeDestination.promoteActiveToNewScheme();
    // Return the scheme.
    return schemeDestination.getScheme();
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
