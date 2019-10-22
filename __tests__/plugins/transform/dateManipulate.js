'use strict';

const _ = require('lodash');
const DateManipulate = require('../../../lib/plugins/transform/dateManipulate');

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
const dateManipulate = new (DateManipulate(BaseXform))();

let value;

describe('Date format', () => {
  const constantDate = new Date('2013-02-08T00:00:00-06:00');

  beforeAll(() => {
    global.Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };
    _.unset(dateManipulate, ['options']);
  });
  test('Can use add.', async () => {
    const moment = require('moment');
    // Test case value.
    value = moment('2013-02-08T00:00:00-06:00').utc();
    dateManipulate.options = {
      manipulator: 'add',
      manipulatorArgs: [7, 'days']
    };
    expect(await dateManipulate.transform(value)).toEqual(moment('2013-02-08T00:00:00-06:00').utc().add(7, 'days'));
  });

  test('Can use subtract.', async () => {
    const moment = require('moment');
    // Test case value.
    value = moment('2013-02-08T00:00:00-06:00').utc();
    dateManipulate.options = {
      manipulator: 'subtract',
      manipulatorArgs: [1, 'days']
    };
    expect(await dateManipulate.transform(value)).toEqual(moment('2013-02-08T00:00:00-06:00').utc().subtract(1, 'days'));
  });

  test('Can use subtract with object.', async () => {
    const moment = require('moment');
    // Test case value.
    value = moment('2013-02-08T00:00:00-06:00').utc();
    dateManipulate.options = {
      manipulator: 'subtract',
      manipulatorArgs: {days: 7, months: 1}
    };
    expect(await dateManipulate.transform(value)).toEqual(moment('2013-02-08T00:00:00-06:00').utc().subtract({days: 7, months: 1}));
  });

  test('Bad args returns', async () => {
    const moment = require('moment');
    // Test case value.
    value = moment('2013-02-08T00:00:00-06:00').utc();
    dateManipulate.options = {
      manipulator: 'notafunction',
      manipulatorArgs: {days: 7, months: 1}
    };
    expect(await dateManipulate.transform(value)).toEqual(moment('2013-02-08T00:00:00-06:00').utc().subtract({days: 7, months: 1}));
  });

  test('manipulator not provided.', async () => {
    const moment = require('moment');
    // Test case value.
    value = moment('2013-02-08T00:00:00-06:00').utc();
    dateManipulate.options = {
      manipulatorArgs: [1, 'days']
    };
    expect(await dateManipulate.transform(value)).toEqual(moment('2013-02-08T00:00:00-06:00').utc());
  });

  test('manipulator args not provided.', async () => {
    const moment = require('moment');
    // Test case value.
    value = moment('2013-02-08T00:00:00-06:00').utc();
    dateManipulate.options = {
      manipulator: 'subtract',
    };
    expect(await dateManipulate.transform(value)).toEqual(moment('2013-02-08T00:00:00-06:00').utc());
  });
});
