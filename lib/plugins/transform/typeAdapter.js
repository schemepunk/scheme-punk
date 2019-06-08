'use strict';

const _ = require('lodash');

function _showMeWhatYouGotObject(value, options) {
  if (_.isArray(value)) {
    return 'array';
  }
  if (options.typeAdapterObjectValues) {
    return 'objectValues';
  }
  if (options.typeAdapterObjectValuesArray) {
    return 'objectValuesArray';
  }
  if (options.typeAdapterObjectValuesMerge) {
    return 'objectValuesMerge';
  }
  return 'objectKeys';
}

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
  async transform(value) {
    this.value = value;
    let tempValue = value;
    // We want to figure out what we got.
    // }.hasOwnProperty.call(foo, "bar");
    const varType = this.showMeWhatYouGot();

    if (
      ({}.hasOwnProperty.call(this.options, 'adapterPrevent')
          && this.options.adapterPrevent.indexOf(varType) === -1)
        || !{}.hasOwnProperty.call(this.options, 'adapterPrevent')
    ) {
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
      return _showMeWhatYouGotObject(this.value, this.options);
    }
    if (_.isString(this.value)) {
      return 'string';
    }
    if (_.isNumber(this.value)) {
      return 'number';
    }
    throw new Error(
      `Could not find a type for value ${this.value} in Transform type adapter.`
    );
  }

  // array
  async arrayAdapter(value) {
    return Promise.all(value.map(val => super.transform(val)));
  }

  // object
  objectKeysAdapter(value) {
    const newValue = {};
    return Promise.all(
      Object.keys(value).map(key => super.transform(`${key}`).then(newKey => ({
        key,
        newKey,
      })))
    )
      .then((xforms) => {
        xforms.forEach(({key, newKey}) => {
          newValue[newKey] = value[key];
        });
      })
      .then(() => newValue);
  }

  // object
  objectValuesAdapter(value) {
    const newValue = {};

    return Promise.all(
      Object.keys(value).map(key => super.transform(value[key]).then(tmpValue => ({
        key,
        tmpValue,
      })))
    )
      .then((xforms) => {
        xforms.forEach(({key, tmpValue}) => {
          newValue[key] = tmpValue;
          if (
            _.isEmpty(tmpValue)
              && !_.get(this.options, 'typeAdapter.includeEmpty', true)
          ) {
            delete newValue[key];
          }
        });
      })
      .then(() => newValue);
  }

  // object
  objectValuesMergeAdapter(value) {
    const newValue = {};
    return Promise.all(
      Object.keys(value).map(key => super.transform(value[key]))
    ).then((xforms) => {
      xforms.forEach((tmpValue) => {
        if (
          !_.isEmpty(tmpValue)
            || _.get(this.options, 'typeAdapter.includeEmpty', true)
        ) {
          if (_.get(this.options, 'typeAdapter.concatArrays', false)) {
            _.mergeWith(newValue, tmpValue, (objValue, srcValue) => {
              if (Array.isArray(objValue)) {
                if (_.get(this.options, 'typeAdapter.uniqArrays', false)) {
                  return _.uniq([...objValue, ...srcValue]);
                }
                return [...objValue, ...srcValue];
              }
              return undefined;
            });
          }
          else {
            _.merge(newValue, tmpValue);
          }
        }
      });
      return newValue;
    });
  }

  // object
  objectValuesArrayAdapter(value) {
    return Promise.all(
      Object.keys(value).map(key => super.transform(value[key]))
    );
  }

  stringAdapter(value) {
    return super.transform(value);
  }

  numberAdapter(value) {
    return super.transform(value);
  }
};
