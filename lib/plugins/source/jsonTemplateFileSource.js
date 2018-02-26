'use strict';

const fs = require('fs-extra');
const path = require('path');

// eslint-disable-next-line max-len
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getTraceIndex"] }] */

/**
 * This is a source mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Function to set a file containing an object template as the source.
   */


  setOrigin(value) {
    this.retrievedOrigin = fs.readJson(path.resolve(
      this.getCallPath(),
      value
    ))
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
    return this.getSchemePunkSourceTarget()
      .then((target) => {
        if (target) {
          return super.getSource();
        }
        return this.getOrigin();
      });
  }
};
