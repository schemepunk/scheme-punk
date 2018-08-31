'use strict';

const ObjectKeysTransform = require('../../../lib/plugins/transform/objectKeysTransform');

class BaseXform {
  constructor(options) {
    this.options = options;
  }

  transform(value) { // eslint-disable-line class-methods-use-this
    return value;
  }

  getHoldOvers() {
    return Promise.resolve(this.holdOvers);
  }
}
const objectKeysTransform = new (ObjectKeysTransform(BaseXform))();

let value;

describe('Object keys', () => {
  test('objectKeysTransformNoSuper.', () => {
    value = {
      test1: 'thing',
      test2: 'thing2',
      test3: 'thing3'
    };
    expect(objectKeysTransform.transform(value)).toEqual(['test1', 'test2', 'test3']);
  });
});
