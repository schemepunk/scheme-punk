'use strict';

const DelimitValues = require('../../../lib/plugins/transform/delimitValues');

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

  test('Default delimit is comma.', async () => {
    expect(await delimitValues.transform(value)).toBe('test1,test2,test3');
  });
  test('Can specify a custom delimiter.', async () => {
    // Emulate a custom option from a scheme.
    delimitValues.options = {
      sourceDelimiter: '-'
    };
    expect(await delimitValues.transform(value)).toBe('test1-test2-test3');
  });
});
