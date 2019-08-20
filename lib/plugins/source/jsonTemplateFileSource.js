'use strict';

const fs = require('fs-extra');
const path = require('path');

const FILE_CACHE = {};

// eslint-disable-next-line max-len
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getTraceIndex"] }] */

/**
 * This is a source mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = (superclass) => class extends superclass {
  /**
     * Method to get the JSON contents of a file, either from cache or the fs.
     *
     * @param {string} jsonPath
     *   The path to the file to load.
     *
     * @return {Promise<Object>}
     *   Resolves with the JSON contents of a file.
     */
  static _getJSON(jsonPath) {
    if (FILE_CACHE[jsonPath]) {
      return Promise.resolve(FILE_CACHE[jsonPath]);
    }

    return fs.readJson(jsonPath).then((obj) => {
      FILE_CACHE[jsonPath] = obj;
      return obj;
    });
  }

  /**
     * Function to set a file containing an object template as the source.
     */
  setOrigin(value) {
    this.retrievedOrigin = this.constructor
      ._getJSON(path.resolve(this.getCallPath(), value))
      .then((packageObj) => {
        this.retrievedOrigin = packageObj;
        return packageObj;
      });

    if (super.setOrigin) super.setOrigin(this.retrievedOrigin);
  }

  /**
     * getSource gets the source for schemePunk based on our origin and target.
     *
     * @return {Promise} source
     *    Gets the target from the origin.
     */
  getSource() {
    return this.getSchemePunkSourceTarget().then((target) => {
      if (target) {
        return super.getSource();
      }
      return this.getOrigin();
    });
  }
};
