'use strict';

jest.mock('mustache');
const mustache = require('mustache');
mustache.render = jest.fn();

const TokenTemplateValues = require('../../../lib/plugins/transform/tokenTemplateValues');

class BaseXform {
  constructor(options, holdOvers = {}) {
    this.options = options;
    this.holdOvers = holdOvers;
  }

  async transform(value) { // eslint-disable-line class-methods-use-this
    return value;
  }

  async getHoldOvers() {
    return this.holdOvers;
  }

  getCallPath() { // eslint-disable-line class-methods-use-this
    return __dirname;
  }

  getTemplateObject() {
    return this.templateObject;
  }
}

let value;
let mocks = [];

describe('Token Template Values Tests', () => {
  afterEach(() => {
    mocks.forEach((mock) => mock.mockRestore());
    mocks = [];
  });

  test('Use a template in JSON format mustache spied', async () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template using tokens.
    jest.spyOn(mustache, 'render')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('');
    mocks.push(mustache.render);
    tokenTemplateValues.options = {
      origin: '../../__helpers__/templates/templateJson.tpl',
      json: true,
      unescape: true,
      named: false,
      tokens: {
        test: 'testKey2'
      }
    };
    // Set holdovers.
    tokenTemplateValues.holdOvers = {monkey: 'toofer'};
    // Test case value.
    value = {
      name: 'testName',
      testKey: 'item0',
      testKey2: 'item1'
    };
    await tokenTemplateValues.transform(value);
    expect(mustache.render).toHaveBeenCalled();
  });
});
