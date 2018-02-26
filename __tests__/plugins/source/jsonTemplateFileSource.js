'use strict';

class sourceBase {
  init(options, scheme) {
    this.scheme = scheme;
    this.setOrigin(options.origin);
    return this.getOrigin()
      .then(() => this);
  }
  setOrigin() {} // eslint-disable-line class-methods-use-this
  setTarget(targetValue) {
    this.schemePunkSourceTarget = targetValue;
  }
  getSchemePunkSourceTarget() {
    return Promise.resolve(this.schemePunkSourceTarget);
  }
  getOrigin() {
    return Promise.resolve(this.retrievedOrigin);
  }
  getCallPath() { // eslint-disable-line class-methods-use-this
    return __dirname;
  }
}

class sourceBase2 {
  init(options, scheme) {
    this.scheme = scheme;
    this.setOrigin(options.origin);
    this.setTarget(options.target);
    return this.getOrigin()
      .then(() => this);
  }
  setTarget(targetValue) {
    this.schemePunkSourceTarget = targetValue;
  }
  getSchemePunkSourceTarget() {
    return Promise.resolve(this.schemePunkSourceTarget);
  }
  getOrigin() {
    return Promise.resolve(this.retrievedOrigin);
  }
  getCallPath() { // eslint-disable-line class-methods-use-this
    return __dirname;
  }
  getSource() {
    return Promise.all([this.getOrigin(), this.getSchemePunkSourceTarget()])
      .then(([origin, target]) => origin[target]);
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
      origin: '../../__helpers__/schemes/sourceSchema.json',
      target: null
    };
    return source.init(options, scheme, holdOvers)
      .then(() => source.getOrigin())
      .then(schemer => expect(schemer).toMatchSnapshot());
  });

  test('Get Source.', () => {
    expect.assertions(1);
    const source = new (JsonTemplateFileSource(sourceBase)); // eslint-disable-line new-parens
    options = {
      origin: '../../__helpers__/schemes/sourceSchema.json',
      target: null
    };

    return source.init(options, scheme, holdOvers)
      .then(() => source.getSource())
      .then(sourceStuff => expect(sourceStuff).toEqual({
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
      }));
  });

  test('Super call json origin.', () => {
    expect.assertions(1);
    options = {
      origin: '../../__helpers__/schemes/sourceSchema.json',
      target: 'numberProperty'
    };
    const source = new (JsonTemplateFileSource(sourceBase2)); // eslint-disable-line new-parens
    return source.init(options, scheme, holdOvers)
      .then(() => source.getSource())
      .then(sourceStuff => expect(sourceStuff).toEqual({
        description: 'A number property on this entity.',
        type: 'integer',
        minimum: 0,
        exclusiveMinimum: true
      }));
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
      origin: '../../__helpers__/schemes/sourceSchema.json',
      target: null
    };
    const source = new Two();
    source.init(options, scheme, holdOvers);

    expect(sourceBase2.prototype.init).toHaveBeenCalled();
  });
});
