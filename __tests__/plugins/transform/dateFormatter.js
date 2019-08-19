'use strict';

const _ = require('lodash');
const DateFormatter = require('../../../lib/plugins/transform/dateFormatter');

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
const dateFormatter = new (DateFormatter(BaseXform))();

let value;

describe('Date format', async () => {
  const constantDate = new Date('2013-02-08T00:00:00-06:00');

  beforeAll(() => {
    global.Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };
  });
  test('a passed date can be formatted.', async () => {
    const moment = require('moment');
    // Test case value.
    value = moment('2013-02-08T00:00:00-06:00');
    dateFormatter.options = {
      outputFormat: 'YYYY-MM-DD'
    };
    expect(await dateFormatter.transform(value)).toBe('2013-02-08');
  });

  test('No date passed uses now and formats', async () => {
    // set options
    dateFormatter.options = {
      outputFormat: 'YYYY-MM-DD'
    };
    expect(await dateFormatter.transform()).toEqual('2013-02-08');
  });

  test('A bad format throws', async () => {
    const moment = require('moment');
    // Test case value.
    value = moment('2013-02-08T00:00:00-06:00');
    // Set Options
    dateFormatter.options = {
      outputFormat: 14
    };
    try {
      await dateFormatter.transform(value);
    }
    catch (error) {
      expect(error.message).toBe('format.match is not a function');
    }
  });

  test('No format provided gets no format', async () => {
    // Test case value.
    const moment = require('moment');
    // Test case value.
    _.unset(dateFormatter, ['options', 'outputFormat']);

    value = moment('2013-02-08T00:00:00-06:00');
    expect(await dateFormatter.transform(value.utc())).toEqual('2013-02-09T00:00:00Z');
  });

  test('Can use moment presets.', async () => {
    const moment = require('moment');
    // Test case value.
    dateFormatter.options = {
      outputFormat: 'LT'
    };
    value = moment('2013-02-08T00:00:00-06:00');
    expect(await dateFormatter.transform(value)).toEqual('12:00 AM');
  });
});
