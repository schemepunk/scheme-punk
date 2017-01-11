'use strict';

// Require mixin.
const JsonTemplateFileSource = require('../lib/plugins/source/jsonTemplateFileSource');

// Test scheme.
const schemer = {
  originalScheme: {
    test1: 'thing',
    test2: 'thing2',
    test3: 'thing3'
  }
};

// A super class.
const tester = class {
  constructor(options, scheme) {
    this.scheme = scheme;
    this.setOrigin(options.origin);
  }
  setTarget(targetValue) {
    this.schemePunkSourceTarget = targetValue;
  }

  /**
   * getSchemePunkSourceTarget returns the target of our origin containing
   * our desired source.
   *
   * @return this.schemePunkSourceTarget;
   */
  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }
  getOrigin() {
    return this.retrievedOrigin;
  }
};

// A second super class with an setOrigin Implemented.
const tester2 = class {
  constructor(options, schema) {
    this.scheme = schema;
    this.setOrigin(options.origin);
    this.setTarget(options.target);
  }
  setOrigin(originValue) {
    this.retrievedOrigin = originValue;
  }
  /**
   * setTarget - sets the target we will use against the origin to get our
   * source.
   *
   * @param  targetValue
   *   A target to use to find the value for our source.
   *
   */
  setTarget(targetValue) {
    this.schemePunkSourceTarget = targetValue;
  }

  /**
   * getSchemePunkSourceTarget returns the target of our origin containing
   * our desired source.
   *
   * @return this.schemePunkSourceTarget;
   */
  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }
  getOrigin() {
    return this.retrievedOrigin;
  }
};

const options = {
  origin: '../../../test/helpers/sourceSchema.json',
  target: null
};

const options2 = {
  origin: '../../../test/helpers/sourceSchema.json',
  target: 'numberProperty'
};

// Create implementing class with mixin for first case.
const One = class SchemePunkSchemeSourceTest extends JsonTemplateFileSource(tester) {};

const objTest = new One(options, schemer);

// Create implementing class with mixin for second case.
const Two = class SchemePunkSchemeSourceTest2 extends JsonTemplateFileSource(tester2) {
  setOrigin(passedValue) {
    super.setOrigin(passedValue);
  }
};

const objTest2 = new Two(options2, schemer);

// console.log(schemePunkTransform.constructor.name);

module.exports = {

  retrieveJsonOrigin: (test) => {
    test.expect(2);
    objTest.setOrigin('../../../test/helpers/sourceSchema.json');
    test.deepEqual(
      objTest.retrievedOrigin,
      {
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
      }
    );
    test.deepEqual(
      objTest.getSource(),
      {
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
      }
    );
    test.done();
  },
  retrieveJsonOriginCallSuper: (test) => {
    objTest2.setOrigin('test/helpers/sourceSchema.json');
    test.deepEqual(
      objTest2.getSource(),
      {
        description: 'A number property on this entity.',
        type: 'integer',
        minimum: 0,
        exclusiveMinimum: true
      }
    );
    test.deepEqual(
      objTest2.getTraceIndex(0),
      0
    );
    test.deepEqual(
      objTest2.getTraceIndex(2),
      1
    );
    test.done();
  }
};
