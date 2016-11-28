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
  transform(value) {
    let temp = value.map(item => '\b'.concat(item));
    temp = temp.map(item => item.concat('\b'));
    temp.push(',');
    let varString = temp.join('|');
    varString = '('.concat(varString);
    varString = varString.concat(')*');
    // Call super.transform and pass along the new value to honor composition.
    return super.transform(varString);
  }
};
