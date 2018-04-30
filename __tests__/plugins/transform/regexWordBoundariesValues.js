'use strict';

const RegexWordBoundariesValues = require('../../../lib/plugins/transform/regexWordBoundariesValues');

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
const regexWordBoundariesValues = new (RegexWordBoundariesValues(BaseXform))();

let value;

describe('RegEx', () => {
  test('regExTransform.', () => {
    // Test case value.
    value = [
      'test1',
      '-test',
      'test3'
    ];
    expect(regexWordBoundariesValues.transform(value)).toEqual('(\\btest1\\B|\\B-test\\b|\\btest3\\B|,)*');
  });
});
