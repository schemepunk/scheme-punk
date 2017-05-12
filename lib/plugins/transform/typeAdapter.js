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
   * Function to adapt json values of different shapes to transformers. mixin
   * schemes can use the this.options.adapterPrevent to override the adapter
   * behavior for certain kinds of objects. This adapter can be overriden
   * with other adapter behaviors substituted.
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

    if (({}.hasOwnProperty.call(this.options, 'adapterPrevent')
      && this.options.adapterPrevent.indexOf(varType) === -1) ||
      !{}.hasOwnProperty.call(this.options, 'adapterPrevent')) {
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
      if (this.options.typeAdapterObjectValues) {
        return 'objectValues';
      }
      if (this.options.typeAdapterObjectValuesArray) {
        return 'objectValuesArray';
      }
      return 'objectKeys';
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
  objectKeysAdapter(value) {
    const newValue = {};
    Object.keys(value).forEach((key) => {
      const newKey = super.transform(`${key}`);
      newValue[newKey] = value[key];
    });
    return newValue;
  }

  // object
  objectValuesAdapter(value) {
    const newValue = {};
    Object.keys(value).forEach((key) => {
      const tmpValue = super.transform(value[key]);
      newValue[key] = tmpValue;
      if (_.isEmpty(tmpValue) && !_.get(this.options, 'typeAdapter.includeEmpty', true)) {
        delete newValue[key];
      }
    });
    return newValue;
  }

  // object
  objectValuesArrayAdapter(value) {
    const newValue = [];
    Object.keys(value).forEach((key) => {
      newValue.push(super.transform(value[key]));
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
