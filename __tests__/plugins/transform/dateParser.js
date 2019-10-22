'use strict';

const _ = require('lodash');
const DateParser = require('../../../lib/plugins/transform/dateParser');

class BaseXform {
  constructor(options) {
    this.options = options;
  }

  async transform(value) { // eslint-disable-line class-methods-use-this
    return value.format('YYYY-MM-DD');
  }

  async getHoldOvers() {
    return this.holdOvers;
  }
}
const dateParse = new (DateParser(BaseXform))();

let value;

describe('Date parse', () => {
  const constantDate = new Date('2013-02-08T00:00:00-06:00');

  beforeAll(() => {
    global.Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };
  });
  test('string can be parsed', async () => {
    // Test case value.
    value = '2013-02-08';
    expect(await dateParse.transform(value)).toBe('2013-02-08');
  });

  test('string with inputFormat can be parsed', async () => {
    // set options
    dateParse.options = {
      inputFormat: 'YYYY-MM-DD'
    };
    // Test case value.
    value = '2013-02-08';
    expect(await dateParse.transform(value)).toEqual('2013-02-08');
  });

  test('string with bad inputFormat errors', async () => {
    // Set Options
    dateParse.options = {
      inputFormat: 14
    };
    // Test case value.
    value = '2013-02-08';
    try {
      await dateParse.transform(value);
    }
    catch (error) {
      expect(error.message).toBe('expandFormat(...).match is not a function');
    }
  });

  test('other formats with spread are cool array', async () => {
    // Test case value.
    _.unset(dateParse, ['options']);
    value = [2013, 2, 8, 0, 0, 0, 0];
    expect(await dateParse.transform(value)).toEqual('2013-02-08');
  });

  test('other formats with spread are cool object', async () => {
    // Test case value.
    value = {
      years: '2013', months: '2', date: '8', hours: '0', minutes: '0', seconds: '0', milliseconds: '000'
    };
    expect(await dateParse.transform(value)).toEqual('2013-02-08');
  });

  test('nothing provided gives now.', async () => {
    value = '';
    expect(await dateParse.transform(value)).toEqual('2013-02-08');
  });

  test('undefined provided gives now.', async () => {
    expect(await dateParse.transform()).toEqual('2013-02-08');
  });

  test('problems.', async () => {
    dateParse.options = {
      inputFormat: 'YYY-MM-DD'
    };
    value = 'n';
    try {
      await dateParse.transform(value);
    }
    catch (e) {
      expect(e.message).toEqual('The data passed to the date formatter could not be transformed into valid date.');
    }
  });

  test('problems.', async () => {
    dateParse.options = {
      inputFormat: 'YYY-MM-DD',
      inputUseUtc: true
    };
    value = '2013-08-02';
    expect(await dateParse.transform()).toEqual('2013-02-08');
  });
});
