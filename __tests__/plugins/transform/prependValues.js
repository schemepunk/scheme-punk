'use strict';

const PrependValues = require('../../../lib/plugins/transform/prependValues');

class BaseXform {
  constructor(options) {
    this.options = options;
  }

  transform(value) { // eslint-disable-line class-methods-use-this
    return value;
  }
}
const prependValues = new (PrependValues(BaseXform))();

let value;

describe('Object keys', () => {
  test('objectKeysTransformNoSuper.', () => {
    // Set options source prepend.
    prependValues.options = {
      sourcePrepend: '-'
    };
    // Test case value.
    value = 'test3';
    expect(prependValues.transform(value)).toEqual('-test3');
  });
});
