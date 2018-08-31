'use strict';

const DelimitValues = require('../../../lib/plugins/transform/delimitValues');

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
const delimitValues = new (DelimitValues(BaseXform))();

let value;


describe('Delimit Values tests', () => {
  beforeEach(() => {
    value = [
      'test1',
      'test2',
      'test3'
    ];
  });

  test('Default delimit is comma.', () => {
    expect(delimitValues.transform(value)).toBe('test1,test2,test3');
  });
  test('Can specify a custom delimiter.', () => {
    // Emulate a custom option from a scheme.
    delimitValues.options = {
      sourceDelimiter: '-'
    };
    expect(delimitValues.transform(value)).toBe('test1-test2-test3');
  });
});
