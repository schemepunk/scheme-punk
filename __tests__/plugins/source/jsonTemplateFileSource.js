'use strict';

class sourceBase {
  constructor(options, scheme) {
    this.scheme = scheme;
    this.setOrigin(options.origin);
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
  setOrigin(origin) {
    super.setOrigin(origin);
  }
}

class sourceBase2 {
  constructor(options, schema) {
    this.scheme = schema;
    this.setOrigin(options.origin);
    this.setTarget(options.target);
  }
  setOrigin(originValue) {
    this.retrievedOrigin = originValue;
  }
  setTarget(targetValue) {
    this.schemePunkSourceTarget = targetValue;
  }
}

const JsonTemplateFileSource = require('../../../lib/plugins/source/jsonTemplateFileSource');

let mocks = [];
const scheme = {
  originalScheme: {
    test1: 'thing',
    test2: 'thing2',
    test3: 'thing3'
  }
};

const holdOvers = {};

describe('activeSchemeSource', () => {
  afterEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });

  test('Json Template file source.', () => {
    expect.assertions(2);
    const source = new (JsonTemplateFileSource(sourceBase)); // eslint-disable-line new-parens
    source.init({}, scheme, holdOvers);
    source.options = {
      origin: '../../__tests__/__helpers__/schemes/sourceSchema.json',
      target: null
    };
    source.setOrigin('../../__tests__/__helpers__/schemes/sourceSchema.json');
    expect(source.retrievedOrigin).toEqual({
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
  test('Json Template file source second test.', () => {
    expect.assertions(3);
    const source = new (JsonTemplateFileSource(sourceBase2)); // eslint-disable-line new-parens
    source.init({}, scheme, holdOvers);
    source.options = {
      origin: '../../__tests__/__helpers__/schemes/sourceSchema.json',
      target: null
    };
    source.setOrigin('../../__tests__/__helpers__/schemes/sourceSchema.json');
    expect(source.getSource()).toEqual({
      description: 'A number property on this entity.',
      type: 'integer',
      minimum: 0,
      exclusiveMinimum: true
    });
    expect(source.getTraceIndex(0)).toEqual(0);
    expect(source.getTraceIndex(2).toEqual(1));
  });
});
