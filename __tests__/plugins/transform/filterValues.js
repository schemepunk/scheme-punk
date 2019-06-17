'use strict';

const FilterValues = require('../../../lib/plugins/transform/filterValues');

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
const filterValues = new (FilterValues(BaseXform))();

let value;
let value2;

describe('Delimit Values tests', () => {
  beforeEach(() => {
    filterValues.options = {
      filterItems: [
        2,
        4
      ],
    };
    // Test case value.
    value = {
      attribute1: 1,
      attribute2: 2,
      attribute3: 3,
      attribute4: 4
    };
    value2 = [1, 2, 3, 4];
  });

  test('Filter out.', async () => {
    filterValues.options.filterBias = 'out';
    expect(await filterValues.transform(value)).toEqual({
      attribute1: 1,
      attribute3: 3
    });
  });
  test('Filter in.', async () => {
    filterValues.options.filterBias = 'in';
    expect(await filterValues.transform(value)).toEqual({
      attribute2: 2,
      attribute4: 4
    });
  });
  test('Filter out array.', async () => {
    filterValues.options.filterBias = 'out';
    expect(await filterValues.transform(value2)).toEqual([
      1,
      3
    ]);
  });
  test('Filter in array.', async () => {
    filterValues.options.filterBias = 'in';
    expect(await filterValues.transform(value2)).toEqual([
      2,
      4
    ]);
  });
  test('Non array or object will throw.', async () => {
    filterValues.options.filterBias = 'in';
    try {
      await filterValues.transform('this value');
    }
    catch (error) {
      expect(error.message).toBe('Value must be an object or an array to filter.');
    }
  });
});
