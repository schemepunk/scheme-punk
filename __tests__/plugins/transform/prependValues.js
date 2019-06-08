'use strict';

const PrependValues = require('../../../lib/plugins/transform/prependValues');

class BaseXform {
  constructor(options) {
    this.options = options;
  }

  async transform(value) { // eslint-disable-line class-methods-use-this
    return value;
  }

  async getHoldOvers() {
    return this.holdOvers;
  }
}
const prependValues = new (PrependValues(BaseXform))();

let value;

describe('Object keys', async () => {
  test('objectKeysTransformNoSuper.', async () => {
    // Set options source prepend.
    prependValues.options = {
      sourcePrepend: '-'
    };
    // Test case value.
    value = 'test3';
    expect(await prependValues.transform(value)).toEqual('-test3');
  });
});
