'use strict';

const _ = require('lodash');
const {FAILED_SOURCE_PLUGIN} = require('../../_errors');
const SchemePunkError = require('../../SchemePunkErrors');

const msg = 'ContigentSource plugin requires an object with properties must be passed via options.'; // eslint-disable-line max-len


/**
 * A dynamic contigent element
 * @typedef {Object} contingentItem
 * @property {boolean} type
 *   The type of contingent item. May be dynamic, static, or holdOver.
 * @property {string} path
 *   The path where we will set the value on the object we are setting for
 *     the source or holdOver for this contingentItem.
 * @property {string} [target]
 *   A target path used with contigentItems that are of the dynamic type.
 *     The value at this path in the original Scheme will be set to the
 *       specified contigentItem path.
 * @property {string} [value]
 *   A value used with contingentItems of the static type. Which is a pass
 *     through from options to the object set as the source for this contigent
 *       item at the path provided.
 * @property {Object} [holdOver]
 *   An object containing holdOver options. HoldOver variables can be static,
 *     set from the contigent Object (so order becomes consequential) or can
 *       be set from the Origin. HoldOvers are passed through source
 *         -> transform -> destination and are available at getHoldOvers()
 *           in each.
 * @property {string} holdOver.type
 *   A type for the holdOver. Can be static, contingent, or dynamic
 * @property {string} [holdOver.path]
 *   A path to retrieve a value for this holdOver either in the contingent
 *     or the origin depending on the holdOver.type.
 * @property {string} [holdOver.value]
 *   A value used in conjunction with the static holdOver.type.
 */

/**
   * Function to source a scheme based upon the value of a target
   *   in the originalScheme.
   *
   * @param {*} superclass
   *  A source superclass.
   * @return {Class}
   *  The result of a source class.
   * @mixin
   */
module.exports = superclass => class extends superclass {
/**
 * Creates a source class.
 * @param {Object} options
 *   Options for the source.
 * @param {Object} options.contingencies
 *   An object keyed by possible values of the target or defined/undefined.
 * @param {Object[]} options.contingencies[]
 *   An Array of contigency options based upond the value of the contigency.
 * @param {...contigentItem} options.contingencies
 *   A configuration contingent item based on this contigency value.
 * @param {string} [options.reducer]
 *   This string represents a path in the contigency object that when specified
 *     will return a single value from the contigency object and not the
 *       contigency object itself.
 * @param {Object} scheme
 *   The scheme.
 * @param {Object} holdOvers
 *   Any holdovers.
 * @param {String} callPath
 *   A call path used as a base path for file operation sources
 *   like templates.
 * @returns {void}
 */
  async init(options, scheme, holdOvers, callPath = '') {
    await super.init(options, scheme, holdOvers, callPath);
    const contingencies = _.get(options, ['contingencies']);
    if (typeof contingencies !== 'object') {
      throw new SchemePunkError(FAILED_SOURCE_PLUGIN, msg);
    }
    this.setContingencies(options.contingencies); // The list of contigent values and holdovers we will set.
    this.setReducer(_.get(options, 'reducer', false));
    return this;
  }

  /**
   * Sets the reducer, an attribute of the contigentObject.
   *
   * @param {string} reducer
   *   An attribute name from the contigentObject that will be formed.
   * @returns {void}
   */
  setReducer(reducer) {
    this.reducer = reducer;
  }

  /**
   * Gets the reducer.
   *
   * @returns {string | boolean}
   *   Returns the reducer if it was passed in the options or false if it
   *     was not.
   */
  getReducer() {
    return this.reducer;
  }

  /**
   * Function to set orignal scheme as the origin.
   * @returns {void}
   */
  setOrigin() {
    this.retrievedOrigin = this.scheme.originalScheme;
    if (super.setOrigin) super.setOrigin(this.retrievedOrigin);
  }

  /**
   * Sets contingencies from options.
   *
   * @param {Object} contingencies
   *   A contingencies object filled with contigentItems.
   * @returns {void}
   */
  setContingencies(contingencies) {
    if (!Object.keys(contingencies).length) {
      throw new SchemePunkError(FAILED_SOURCE_PLUGIN, msg);
    }
    this.contingencies = contingencies;
  }

  /**
   * Returns contingencies.
   *
   * @returns {Object} contingencies
   *   A contingencies object from config.
   */
  getContingencies() {
    return this.contingencies;
  }

  /**
   * Returns a @ref coni
   *
   * @param {string} path
   *   A path in the contigencies.
   * @returns {Array.contigentItem | False}
   *   An array of contingentItems.
   */
  getSwitches(path) {
    return _.get(
      this.getContingencies(),
      path,
      false
    );
  }

  /**
   * Returns a particular switch by type.
   *
   * @returns {Array} switches
   *   A switch.
   */
  async getSwitchByType() {
    let switches;
    const target = await this.getSchemePunkSourceTarget();
    const origin = await this.getOrigin();

    switches = this.getSwitches('undefined');

    const value = _.get(origin, target, false);

    if (value) {
      switches = this.getSwitches('defined');
    }

    if (this.getSwitches(value)) {
      switches = this.getSwitches(value);
    }

    return switches;
  }

  /**
   * Make contigency products from contigency array.
   *
   * @param {Array} items
   *   An array of contigentItems.
   * @returns {Object} product
   *   An object of contigencySource and tmpHoldOvers.
   */
  async getContingencyProducts(items) {
    const contingencySource = {};
    const tmpHoldOvers = {};
    const origin = await this.getOrigin();

    Object.keys(items).forEach((key) => {
      // these items will be static, dynamic, or holdovers.
      switch (items[key].type) {
        case 'static':
        // set static items in contingencySource.
          _.set(contingencySource, items[key].path, items[key].value);
          break;
        case 'dynamic':
        // Statements executed when the result of expression matches value2
          _.set(contingencySource, items[key].path, _.get(origin, items[key].target));
          break;
        case 'holdOver':
          _.set(tmpHoldOvers, items[key].path, items[key].holdover);
          break;
        /* no default */
      }
    }, this);

    return {
      contingencySource,
      tmpHoldOvers,
    };
  }

  /**
   * Sets any Holdovers for the source based on the contigencies.
   *
   * @param {Object} products
   *   A contigency products object.
   * @returns {undefined}
   */
  async setProductHoldovers(products) {
    const {tmpHoldOvers} = products;
    const origin = await this.getOrigin();
    const holdOvers = await this.getHoldOvers();

    if (!Object.keys(tmpHoldOvers).length) {
      await this.setHoldOvers(_.merge(
        {},
        holdOvers,
        tmpHoldOvers
      ));
      return;
    }

    const holdOverSetter = {
      contingent: holdOverValue => _.get(products.contingencySource, holdOverValue.path),
      dynamic: holdOverValue => _.get(origin, holdOverValue.path)
    };

    // now act on holdovers
    _.forEach(tmpHoldOvers, (holdoverValue, key) => {
      tmpHoldOvers[key] = _.get(
        holdOverSetter,
        holdoverValue.type,
        holdOverValue => holdOverValue.value
      )(holdoverValue);
    });

    await this.setHoldOvers(_.merge(
      {},
      holdOvers,
      tmpHoldOvers
    ));
  }


  /**
   * getSource gets the source for schemePunk based on our origin and target.
   *
   * @returns {*} source
   *    Gets the target from the origin.
   */
  async getSource() {
    // Look for value match or defined/undefined in contingencies.
    const switches = await this.getSwitchByType();

    if (!switches) {
      return undefined;
    }

    const products = await this.getContingencyProducts(switches);
    await this.setProductHoldovers(products);

    if (this.getReducer()) {
      return products.contingencySource[this.getReducer()];
    }
    return products.contingencySource;
  }
};
