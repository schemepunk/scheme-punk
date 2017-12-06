'use strict';

const TokenTemplateValues = require('../../../lib/plugins/transform/tokenTemplateValues');

class BaseXform {
  constructor(options, holdOvers = {}) {
    this.options = options;
    this.holdOvers = holdOvers;
  }

  transform(value) { // eslint-disable-line class-methods-use-this
    return value;
  }

  getHoldOvers() {
    return this.holdOvers;
  }
}

let tokenTemplateValues;

let value;

describe('Token Template Values Tests', () => {
  test('Template only values', () => {
    tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.options = {
      origin: './../../__tests__/__helpers__/templates/templateLiteralTestOne.tpl',
      named: false,
      json: false,
      unescape: false
    };
    // Test case value.
    value = {
      name: 'testName',
      testKey: 'item0',
      testKey2: 'item1'
    };
    expect(tokenTemplateValues.transform(value)).toEqual('Dust template one name is testName, testKey is item0.');
  });

  test('Use a template and replace with passed values using named replacement.', () => {
    tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template using tokens.
    tokenTemplateValues.options = {
      origin: './../../__tests__/__helpers__/templates/templateLiteralTestTwo.tpl',
      named: true,
      json: false,
      unescape: false,
      tokens: {
        name: 'name',
        test: 'testKey2'
      }
    };
    // Test case value.
    value = {
      name: 'testName',
      testKey: 'item0',
      testKey2: 'item1'
    };
    expect(tokenTemplateValues.transform(value)).toEqual('Dust template one name is: testName, test has the value of testKey2: item1.');
  });

  test('Trace index test', () => {
    tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template using tokens.
    expect(tokenTemplateValues.getTraceIndex(1)).toEqual(0);
  });

  test('Use a template with passed values, named variables, and holdOvers.', () => {
    tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template using tokens.
    tokenTemplateValues.options = {
      origin: '../../__tests__/__helpers__/templates/templateLiteralTestThree.tpl',
      named: true,
      json: false,
      unescape: false,
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
    expect(tokenTemplateValues.transform(value)).toEqual('Dust template one name is: toofer, test has the value of testKey2: item1.');
  });

  test('Use a template in JSON format with holdovers', () => {
    tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template using tokens.
    tokenTemplateValues.options = {
      origin: '../../__tests__/__helpers__/templates/templateJson.tpl',
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
    expect(tokenTemplateValues.transform(value)).toEqual({
      test: 'testName',
      item: 'item1',
      thing: [
        'one',
        'two'
      ]
    });
  });

  test('Use a template but pass in an empty object for values and indicate that it should not render empty tokens.', () => {
    tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.options = {
      origin: '../../__tests__/__helpers__/templates/templateFour.tpl',
      template: {
        renderEmptyTokens: false
      }
    };

    // Test case value.
    value = {};
    expect(tokenTemplateValues.transform(value)).toEqual({});
  });

  test('Use a template with text escapes but enforce unescaping.', () => {
    tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.options = {
      origin: '../../__tests__/__helpers__/templates/templateFour.tpl',
      json: false,
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
    expect(tokenTemplateValues.transform(value)).toEqual('Dust template "one" name is: testName, test has the value of \"testKey2: item1.');
  });

  test('Use a template with a simple string value instead of an object.', () => {
    tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.options = {
      origin: '../../__tests__/__helpers__/templates/templateFive.tpl',
      named: false,
      json: false,
      unescape: false
    };

    // Test case value.
    value = 'testBoogie';
    expect(tokenTemplateValues.transform(value)).toEqual('this is a testBoogie');
  });
});
