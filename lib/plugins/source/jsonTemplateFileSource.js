'use strict';

const fs = require('fs-extra');
const path = require('path');

const _ = require('lodash');

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
    this.retrievedOrigin = fs.readJsonSync(path.join(__dirname, value));
    if (super.setOrigin) super.setOrigin(this.retrievedOrigin);
  }

  /**
   * getSource gets the source for schemePunk based on our origin and target.
   *
   * @return source
   *    Gets the target from the origin.
   */
  getSource() {
    if (this.getSchemePunkSourceTarget()) {
      return _.get(this.getOrigin(), this.getSchemePunkSourceTarget());
    }
    return this.getOrigin();
  }
};