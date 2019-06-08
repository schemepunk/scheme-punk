'use strict';

const FilterObjectsValues = require('../../../lib/plugins/transform/filterObjects');

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
const filterObjectValues = new (FilterObjectsValues(BaseXform))();

let value;

describe('Delimit Values tests', () => {
  beforeEach(() => {
    filterObjectValues.options = {
      filterItems: [
        'someProp',
        'nestedProp.someProp'
      ],
    };
    // Test case value.
    value = {
      attribute1: {
        someProp: true,
      },
      attribute2: {
        nestedProp: {
          someProp: true,
        },
      },
      attribute3: {},
      attribute4: {
        someProp: false,
      }
    };
  });

  test('Filter out.', async () => {
    expect.assertions(1);
    filterObjectValues.options.filterBias = 'out';
    expect(await filterObjectValues.transform(value)).toEqual({
      attribute3: {},
      attribute4: {
        someProp: false,
      }
    });
  });
  test('Filter in.', async () => {
    expect.assertions(1);
    filterObjectValues.options.filterBias = 'in';
    expect(await filterObjectValues.transform(value)).toEqual({
      attribute1: {
        someProp: true,
      },
      attribute2: {
        nestedProp: {
          someProp: true,
        },
      },
    });
  });
});
