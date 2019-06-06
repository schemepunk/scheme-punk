'use strict';

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
    return Promise.resolve(this.holdOvers);
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
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Template only values', async () => {
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
    const tValue = await tokenTemplateValues.transform(value);
    expect(tValue).toEqual('Dust template one name is testName, testKey is item0.');
  });
});

describe('Use a template and replace with passed values using named replacement', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template and replace with passed values using named replacement.', async () => {
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
    const tValue = await tokenTemplateValues.transform(value);

    expect(tValue).toEqual('Dust template one name is: testName, test has the value of testKey2: item1.');
  });
});

describe('Use a template with passed values, named variables, and holdOvers.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template with passed values, named variables, and holdOvers.', async () => {
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
    const tValue = await tokenTemplateValues.transform(value);
    expect(tValue).toEqual('Dust template one name is: toofer, test has the value of testKey2: item1.');
  });
});

describe('Use a template in JSON format with holdovers', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template in JSON format with holdovers', async () => {
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
    const tValue = await tokenTemplateValues.transform(value);
    expect(tValue).toEqual({
      test: 'testName',
      item: 'item1',
      thing: [
        'one',
        'two'
      ]
    });
  });
});

describe('Use a template but pass in an empty object for values and indicate that it should not render empty tokens.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template but pass in an empty object for values and indicate that it should not render empty tokens.', async () => {
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
    const tValue = await tokenTemplateValues.transform(value);
    expect(tValue).toEqual({});
  });
});

describe('Use a template with text escapes but enforce unescaping.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template with text escapes but enforce unescaping.', async () => {
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
    const tValue = await tokenTemplateValues.transform(value);
    expect(tValue).toEqual('Dust template "one" name is: testName, test has the value of \"testKey2: item1.'); // eslint-disable-line no-useless-escape
  });
});

describe('Use a template with a simple string value instead of an object.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template with a simple string value instead of an object.', async () => {
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
    const tValue = await tokenTemplateValues.transform(value);

    expect(tValue).toEqual('this is a testBoogie');
  });
});

describe('No File.', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template with a simple string value instead of an object.', async () => {
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
    try {
      await tokenTemplateValues.transform(value);
    }
    catch (error) {
      expect(error.message).toContain('ENOENT:');
    }
  });
});

describe('Token Template Object', () => {
  beforeEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });
  test('Use a template object with an object', async () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.templateObject = {
      title: '{{apiName}}',
      destinationTemplate: "{{=<% %>=}}{<%={{ }}=%>swagger: '2.0', info: {{=<% %>=}}{<%={{ }}=%> title: '{{> title}}' {{=<% %>=}}}<%={{ }}=%> {{=<% %>=}}}<%={{ }}=%>"
    };
    tokenTemplateValues.options = {
      origin: 'notther',
      named: false,
      json: false,
      unescape: false
    };

    // Test case value.
    value = {apiName: 'A test title'};
    const tValue = await tokenTemplateValues.transform(value);

    expect(tValue).toEqual("{swagger: '2.0', info: { title: 'A test title' } }");
  });
  test('Use a template object with an object', async () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.templateObject = {
      title: '{{apiName}}',
      destinationTemplate: '{{=<% %>=}}{<%={{ }}=%> "swagger": "2.0", "info": {{=<% %>=}}{<%={{ }}=%> "title": "{{> title}}" {{=<% %>=}}}<%={{ }}=%> {{=<% %>=}}}<%={{ }}=%>'
    };
    tokenTemplateValues.options = {
      origin: 'notther',
      named: false,
      json: true,
      unescape: false
    };

    // Test case value.
    value = {apiName: 'A test title'};
    const tValue = await tokenTemplateValues.transform(value);

    expect(tValue).toEqual({info: {title: 'A test title'}, swagger: '2.0'});
  });
  test('template target partial', async () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.templateObject = {
      title: '{{apiName}}',
      destinationTemplate: '{{=<% %>=}}{<%={{ }}=%> "swagger": "2.0", "info": {{=<% %>=}}{<%={{ }}=%> "title": "{{> title}}" {{=<% %>=}}}<%={{ }}=%> {{=<% %>=}}}<%={{ }}=%>'
    };
    tokenTemplateValues.options = {
      origin: 'notther',
      named: false,
      json: false,
      unescape: false,
      template: {
        targetPartial: 'title'
      }
    };

    // Test case value.
    value = {apiName: 'A test title'};
    const tValue = await tokenTemplateValues.transform(value);
    expect(tValue).toEqual('A test title');
  });
  test('Filter partials', async () => {
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.templateObject = {
      title: '{{apiName}}',
      altTitle: '{{testName}}',
      destinationTemplate: '{{=<% %>=}}{<%={{ }}=%> "swagger": "2.0", "info": {{=<% %>=}}{<%={{ }}=%> "title": "{{> title}}{{> altTitle}}" {{=<% %>=}}}<%={{ }}=%> {{=<% %>=}}}<%={{ }}=%>'
    };
    tokenTemplateValues.options = {
      origin: 'notther',
      named: false,
      json: false,
      unescape: false,
      template: {
        filterPartials: ['altTitle']
      }
    };

    // Test case value.
    value = {apiName: 'A test title', testName: 'a totally different test title'};
    const tValue = await tokenTemplateValues.transform(value);

    expect(tValue).toEqual('{ "swagger": "2.0", "info": { "title": "a totally different test title" } }');
  });
  test('No destinationTeamplate in the object should be a problem.', async () => {
    expect.assertions(1);
    const tokenTemplateValues = new (TokenTemplateValues(BaseXform))();
    // Set options for a template.
    tokenTemplateValues.templateObject = {
      title: '{{apiName}}'
    };
    tokenTemplateValues.options = {
      origin: 'notther',
      named: false,
      json: true,
      unescape: false
    };

    // Test case value.
    value = 'testBoogie';
    try {
      await tokenTemplateValues.transform(value);
    }
    catch (error) {
      expect(error.message).toEqual('Using templated object with no destination template value.');
    }
  });
});
