'use strict';

const ObjectKeysTransform = require('../../../lib/plugins/transform/objectKeysTransform');

class BaseXform {
  constructor(options) {
    this.options = options;
  }

  async transform(value) { // eslint-disable-line class-methods-use-this
    return value;
  }

  async getHoldOvers() {
    return Promise.resolve(this.holdOvers);
  }
}
const objectKeysTransform = new (ObjectKeysTransform(BaseXform))();

let value;

describe('Object keys', () => {
  test('objectKeysTransformNoSuper.', async () => {
    value = {
      test1: 'thing',
      test2: 'thing2',
      test3: 'thing3'
    };
    expect(await objectKeysTransform.transform(value)).toEqual(['test1', 'test2', 'test3']);
  });
});
