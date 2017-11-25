'use strict';

const AppendValues = require('../../../lib/plugins/transform/appendValues');

class BaseXform {
  constructor(options) {
    this.options = options;
  }

  transform(value) { // eslint-disable-line class-methods-use-this
    return value;
  }
}
const appendValues = new (AppendValues(BaseXform))();

appendValues.options = {
  sourceAppend: '-'
};

describe('Append Values test', () => {
  test('Can append values', () => {
    expect(appendValues.transform('test')).toBe('test-');
  });
});
