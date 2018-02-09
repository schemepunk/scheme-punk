'use strict';

const schema = {
  description: {
    description: 'A description for this resource.',
    type: 'string'
  },
  numberProperty: {
    description: 'A number property on this entity.',
    exclusiveMinimum: true,
    minimum: 0,
    type: 'integer'
  },
  title: {
    description: 'A title.',
    type: 'string'
  }
};


class sourceBase {
  init(options, scheme) {
    this.scheme = scheme;
    this.setOrigin(options.origin);
  }
  setOrigin() {} // eslint-disable-line class-methods-use-this
  setTarget(targetValue) {
    this.schemePunkSourceTarget = targetValue;
  }
  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }
  getOrigin() {
    return this.retrievedOrigin;
  }
}

class sourceBase2 {
  init(options, scheme) {
    this.scheme = scheme;
    this.setOrigin(options.origin);
    this.setTarget(options.target);
  }
  setTarget(targetValue) {
    this.schemePunkSourceTarget = targetValue;
  }
  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }
  getOrigin() {
    return this.retrievedOrigin;
  }
}

const JsonTemplateFileSource = require('../../../lib/plugins/source/jsonTemplateFileSource');

let mocks = [];
let options;
const scheme = {
  originalScheme: {
    test1: 'thing',
    test2: 'thing2',
    test3: 'thing3'
  }
};

const holdOvers = {};

describe('jsonTemplateFileSource', () => {
  afterEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });

  test('Json Template file source set Origin.', () => {
    expect.assertions(1);
    const source = new (JsonTemplateFileSource(sourceBase)); // eslint-disable-line new-parens
    mocks.push(jest.spyOn(sourceBase.prototype, 'setOrigin'));
    options = {
      origin: '../../__tests__/__helpers__/schemes/sourceSchema.json',
      target: null
    };
    source.init(options, scheme, holdOvers);
    expect(sourceBase.prototype.setOrigin).toBeCalledWith(schema);
  });

  test('Get Source.', () => {
    expect.assertions(1);
    const source = new (JsonTemplateFileSource(sourceBase)); // eslint-disable-line new-parens
    options = {
      origin: '../../__tests__/__helpers__/schemes/sourceSchema.json',
      target: null
    };
    source.init(options, scheme, holdOvers);

    expect(source.getSource()).toEqual({
      title: {
        type: 'string',
        description: 'A title.'
      },
      description: {
        type: 'string',
        description: 'A description for this resource.'
      },
      numberProperty: {
        description: 'A number property on this entity.',
        type: 'integer',
        minimum: 0,
        exclusiveMinimum: true
      }
    });
  });

  test('Super call json origin.', () => {
    expect.assertions(3);
    options = {
      origin: '../../__tests__/__helpers__/schemes/sourceSchema.json',
      target: 'numberProperty'
    };
    const source = new (JsonTemplateFileSource(sourceBase2)); // eslint-disable-line new-parens
    source.init(options, scheme, holdOvers);

    expect(source.getSource()).toEqual({
      description: 'A number property on this entity.',
      type: 'integer',
      minimum: 0,
      exclusiveMinimum: true
    });
    expect(source.getTraceIndex(0)).toEqual(0);
    expect(source.getTraceIndex(2)).toEqual(1);
  });

  test('Super implementer', () => {
    expect.assertions(1);
    mocks.push(jest.spyOn(sourceBase2.prototype, 'init'));
    const Two = class SchemePunkSchemeSourceTest2 extends JsonTemplateFileSource(sourceBase2) {
      setOrigin(passedValue) {
        this.origin = passedValue;
      }
    };
    options = {
      origin: '../../__tests__/__helpers__/schemes/sourceSchema.json',
      target: null
    };
    const source = new Two();
    source.init(options, scheme, holdOvers);

    expect(sourceBase2.prototype.init).toHaveBeenCalled();
  });
});
