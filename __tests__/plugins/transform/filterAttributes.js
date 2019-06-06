'use strict';

const FilterAttributesValues = require('../../../lib/plugins/transform/filterAttributes');

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
const filterAttributeValues = new (FilterAttributesValues(BaseXform))();

let value;

describe('Delimit Values tests', () => {
  beforeEach(() => {
    filterAttributeValues.options = {
      filterItems: [
        'attribute2',
        'attribute4'
      ],
    };
    // Test case value.
    value = {
      attribute1: 1,
      attribute2: 2,
      attribute3: 3,
      attribute4: 4
    };
  });

  test('Filter out.', async () => {
    filterAttributeValues.options.filterBias = 'out';
    expect(await filterAttributeValues.transform(value)).toEqual({
      attribute1: 1,
      attribute3: 3
    });
  });
  test('Filter in.', async () => {
    filterAttributeValues.options.filterBias = 'in';
    expect(await filterAttributeValues.transform(value)).toEqual({
      attribute2: 2,
      attribute4: 4
    });
  });
});
