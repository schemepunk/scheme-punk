'use strict';

const _ = require('lodash');

/**
 * This is a transformation mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Function to transform a value by prepending a string to a key, array member
   * or string. This.options will need a prependValue in order to work with
   * this transform.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  transform(value) {
    this.value = value;
    let tempValue = value;
    // We want to figure out what we got.
    // }.hasOwnProperty.call(foo, "bar");
    const varType = this.showMeWhatYouGot();

    if ({}.hasOwnProperty.call(this, 'adapterPrevent')
      && this.adapterPrevent.indexOf(varType) === -1) {
      // Attempt to call method based on object.
      tempValue = this[`${varType}Adapter`](value);
    }
    return tempValue;
  }

 /**   ___
 * . -^   `--,
 * /# =========`-_
 * /# (--====___====\
 * /#   .- --.  . --.|
 * /##   |  * ) (   * ),
 * |##   \    /\ \   / |
 * |###   ---   \ ---  |
 * |####      ___)    #|
 * |######           ##|
 * \##### ---------- /
 * \####           (
 * `\###          |
 * \###         |
 * \##        |
 * \###.    .)
 * `======/
 */
  showMeWhatYouGot() {
    if (_.isNull(this.value)) {
      return 'null';
    }
    if (_.isObjectLike(this.value)) {
      if (_.isArray(this.value)) {
        return 'array';
      }
      return 'object';
    }
    if (_.isString(this.value)) {
      return 'string';
    }
    if (_.isNumber(this.value)) {
      return 'number';
    }
    throw new Error(`Could not find a type for value ${this.value} in Transform type adapter.`);
  }

  // array
  arrayAdapter(value) {
    const newValue = value.map(super.transform, this);
    return newValue;
  }

  // object
  objectAdapter(value) {
    const newValue = {};
    Object.keys(value).forEach((key) => {
      const newKey = super.transform(`${key}`);
      newValue[newKey] = value[key];
    });
    return newValue;
  }

  stringAdapter(value) {
    return super.transform(value);
  }

  numberAdapter(value) {
    return super.transform(value);
  }
};
