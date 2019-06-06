'use strict';

const AppendValues = require('../../../lib/plugins/transform/appendValues');

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
const appendValues = new (AppendValues(BaseXform))();

appendValues.options = {
  sourceAppend: '-'
};

describe('Append Values test', () => {
  test('Can append values', async () => {
    expect(await appendValues.transform('test')).toBe('test-');
  });
});
