'use strict';

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
  async transform(value) {
    // Test for word boundary, it could be a non letter.
    // If so  we should use \B.
    let temp = value.map(item => (item.charAt(0).match(/[a-z]/i) ? String.raw`\b${item}` : String.raw`\B` + item)); // eslint-disable-line max-len
    temp = temp.map(item => (item.charAt(item.length - 1).match(/[a-z]/i) ? String.raw`${item}\b` : String.raw`${item}\B`)); // eslint-disable-line max-len
    temp.push(',');
    let varString = temp.join('|');
    varString = '('.concat(varString);
    varString = varString.concat(')*');
    // Call super.transform and pass along the new value to honor composition.
    return super.transform(varString);
  }
};
