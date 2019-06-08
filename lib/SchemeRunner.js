'use strict';

const _ = require('lodash');
const getLogger = require('./logger');
const SchemePunk = require('./schemePunk');
const SchemePunkErrors = require('./SchemePunkErrors');
const {schemeValidator} = require('./schemeValidator');
const {
  MALFORMED_OR_NO_DATA,
  SCHEME_RUNNER_NOT_INITIALIZED,
  SCHEME_RUNNER_CANT_RUN_SCHEME
} = require('./_errors');

module.exports = class SchemeRunner {
  /**
   *Creates an instance of SchemeRunner.
   * @param {object} [logOptions={}]
   *   A log options object.
   * @param {*} logOptions.logger
   *   A logger that implements the following methods:
   *   info, warn, debug, error, trace. If no logger is provided
   *   loglevel will be used but set to silent by default.
   * @param {object} logOptions.defaultLoggerOptions
   *   Options for the default logger (loglevel)
   * @param {string} [logOptions.defaultLoggerOptions.disableBelow=silent]
   *   Sets the error level for the default logger loglevel. By default
   *     all logging is turned off for the default.
   * @returns {void}
   */
  constructor(logOptions = {}) {
    this.logger = getLogger(logOptions);
  }

  /**
   * Initializes an instance of the schemeRunner.
   * @param {Object} data
   *   A schemePunk data shape from SchemePunk createScheme or a js data object
   *   we wish to transform into one..
   * @param {Object} SchemeArray
   *   An array of schemePunk schemes config that you would like to run
   *   consecutively on the data that's been passed in.
   * @param {Object} molotovOptions
   *   Molotov overrides and cocktail configuration for overriding
   *   and adding to schemePunk's mixins and plugin definitions.
   * @returns {Promise<SchemeRunner>}
   */
  async init(data, schemeArray, molotovOptions) {
    try {
      await schemeValidator({scheme: schemeArray, loggerOptions: {logger: this.logger}});
      this.setData(data);
      this.setSchemes(schemeArray);
      this.setMolotovOptions(molotovOptions);
      return this;
    }
    catch (error) {
      this.logger.error(error.code);
      const msg = error.code;
      error.message = `${SCHEME_RUNNER_NOT_INITIALIZED}: ${msg}`;
      throw error;
    }
  }

  /**
   * Sets an array of schemes that we want to run on this data.
   *
   * @param {Array} schemeArray
   *   A set of schemes that we want to run on this data.
   */
  setSchemes(schemeArray) {
    this.schemes = schemeArray;
  }

  /**
   * Returns the scheme for this schemerunner.
   *
   * @returns {Array}
   *   An array of schemepunk instructions for this schemeRunner
   */
  getSchemes() {
    return this.schemes;
  }

  /**
   * Any molotov options you would like to pass on to schemePunk.
   *
   * @param {object} molotovOptions
   *   A molotov Options object
   * @param {object} molotovOptions.overrides
   *   A molotov overrides object.
   * @param {Array<Cocktail>} molotovOptions.cocktailClasses
   *   An array of CocktailClasses used to override and extend schemePunk.
   */
  setMolotovOptions(molotovOptions) {
    this.molotovOptions = molotovOptions;
  }

  /**
   * Get molotov options for this schemeRunner.
   *   These options will be applied to all schemePunks.
   */
  getMolotovOptions() {
    return this.molotovOptions;
  }

  /**
   * Compacts the schemeRunner steps into a promise chain.
   *
   * @returns {void}
   */
  async setRunnerSchemeSteps() {
    const schemeSteps = [];
    const molotovOptions = this.getMolotovOptions();

    const schemeConfig = this.getSchemes();
    // Ensure that each scheme step has a value.
    const useTheseKeys = Object.keys(schemeConfig).filter(
      value => schemeConfig[value] !== null
    );

    useTheseKeys.forEach((value) => {
      schemeConfig[value].forEach((options) => {
        // Create a schemePunk with the processing step.

        schemeSteps.push(res => new SchemePunk(
          Object.assign({}, options[0]),
          {
            overrides: _.get(molotovOptions, 'overrides', {}),
            cocktailClasses: _.get(molotovOptions, 'cocktailClasses', []),
          },
          {logger: this.logger}
        ).enhance(res));
      });
    });

    this.runnerSchemeSteps = schemeSteps;
  }

  /**
   * Gets the runner steps.
   *
   * @returns {Object}
   *   An Object containing schemePunk steps, schemes and plots.
   *
   */
  getRunnerSchemeSteps() {
    return this.runnerSchemeSteps;
  }

  /**
   * A scheme punk runner which reduces SchemePunk steps and plots
   *   of promises feeding the results of one schemePunk scheme
   *   into the next schemePunk scheme.
   *
   * @returns {Object} - The new composition after all schemes in the scheme
   *   Array have been run.
   */
  async runScheme() {
    // First get schemePunkShape.
    const schemePunkScheme = this.getData();
    this.setRunnerSchemeSteps();
    // Now get scheme steps.
    const schemeRunnerSteps = this.getRunnerSchemeSteps();
    try {
      // Now run the steps by reducing them.
      const schemeItem = await schemeRunnerSteps.reduce(
        (pPromise, cPromise) => pPromise.then(cPromise),
        Promise.resolve(schemePunkScheme)
      );

      this.setData(schemeItem.newScheme);
      return schemeItem.newScheme;
    }
    catch (error) {
      this.logger.error(error.code);
      const msg = error.code;
      error.message = `${SCHEME_RUNNER_CANT_RUN_SCHEME}: ${msg}`;
      throw error;
    }
  }

  /**
   * Sets the scheme according to the incoming shape.
   *
   * @param {Object} data
   *   This will either be a schemePunk scheme shape containing data
   *   objects within the following keys originalScheme, activeScheme and
   *   newScheme, OR, this will be a data object that will be copied
   *   into a schemePunk scheme shape at the 3 keys mentioned above.
   * @returns {void}
   */
  setData(data) {
    if (!data) {
      throw new SchemePunkErrors(MALFORMED_OR_NO_DATA);
    }
    let tmpData = data;
    // If we have a valid schemePunk shape set it here.
    if (
      !_.has(data, 'originalScheme')
      || !_.has(data, 'activeScheme')
      || !_.has(data, 'newScheme')
    ) {
      tmpData = {
        originalScheme: _.cloneDeep(data),
        activeScheme: _.cloneDeep(data),
        newScheme: _.cloneDeep(data),
      };
    }
    this.data = tmpData;
  }

  /**
   * Returns the modified data.
   *
   * @returns {Object}
   *   The data object.
   */
  getData() {
    return this.data;
  }
};
