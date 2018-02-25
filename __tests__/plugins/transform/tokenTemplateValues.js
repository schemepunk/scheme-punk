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
  getCallPath() { // eslint-disable-line class-methods-use-this
    return __dirname;
  }
}

let value;
let mocks = [];

describe('Token Template Values Tests', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Template only values', () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.options = {
      origin: './../../__helpers__/templates/templateLiteralTestOne.tpl',
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
    return tokenTemplateValues.transform(value)
      .then(tValue => expect(tValue).toEqual('Dust template one name is testName, testKey is item0.'));
  });
});

describe('Use a template and replace with passed values using named replacement', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template and replace with passed values using named replacement.', () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template using tokens.
    tokenTemplateValues.options = {
      origin: './../../__helpers__/templates/templateLiteralTestTwo.tpl',
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
    return tokenTemplateValues.transform(value)
      .then(tValue => expect(tValue).toEqual('Dust template one name is: testName, test has the value of testKey2: item1.'));
  });
});

describe('Use a template with passed values, named variables, and holdOvers.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template with passed values, named variables, and holdOvers.', () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template using tokens.
    tokenTemplateValues.options = {
      origin: './../../__helpers__/templates/templateLiteralTestThree.tpl',
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
    return tokenTemplateValues.transform(value)
      .then(tValue => expect(tValue).toEqual('Dust template one name is: toofer, test has the value of testKey2: item1.'));
  });
});

describe('Use a template in JSON format with holdovers', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template in JSON format with holdovers', () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template using tokens.
    tokenTemplateValues.options = {
      origin: './../../__helpers__/templates/templateJson.tpl',
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
    return tokenTemplateValues.transform(value)
      .then(tValue => expect(tValue).toEqual({
        test: 'testName',
        item: 'item1',
        thing: [
          'one',
          'two'
        ]
      }));
  });
});

describe('Use a template but pass in an empty object for values and indicate that it should not render empty tokens.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template but pass in an empty object for values and indicate that it should not render empty tokens.', () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.options = {
      origin: './../../__helpers__/templates/templateFour.tpl',
      template: {
        renderEmptyTokens: false
      }
    };

    // Test case value.
    value = {};
    return tokenTemplateValues.transform(value)
      .then(tValue => expect(tValue).toEqual({}));
  });
});

describe('Use a template with text escapes but enforce unescaping.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template with text escapes but enforce unescaping.', () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.options = {
      origin: './../../__helpers__/templates/templateFour.tpl',
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
    return tokenTemplateValues.transform(value)
      .then(tValue => expect(tValue).toEqual('Dust template "one" name is: testName, test has the value of \"testKey2: item1.')); // eslint-disable-line no-useless-escape
  });
});

describe('Use a template with a simple string value instead of an object.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template with a simple string value instead of an object.', () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.options = {
      origin: './../../__helpers__/templates/templateFive.tpl',
      named: false,
      json: false,
      unescape: false
    };

    // Test case value.
    value = 'testBoogie';
    return tokenTemplateValues.transform(value)
      .then(tValue => expect(tValue).toEqual('this is a testBoogie'));
  });
});

describe('No File.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template with a simple string value instead of an object.', () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.options = {
      origin: 'notther',
      named: false,
      json: false,
      unescape: false
    };

    // Test case value.
    value = 'testBoogie';
    return tokenTemplateValues.transform(value)
      .catch(err => expect(err.message).toContain('ENOENT:'));
  });
});
