'use strict';

const SchemePunkTransformBase = require('../../lib/transform/schemePunkTransform');
const options = require('./../__helpers__/schemePunkTestOptions');

let tmpMocks = [];

beforeEach(() => {
  tmpMocks.forEach((mock) => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Scheme Punk Transform', () => {
  test('Class Construction', () => {
    let testClass;
    expect.assertions(1);
    return SchemePunkTransformBase()
      .then((SchemeTransform) => {
        testClass = SchemeTransform;
        const schemeTransform = new SchemeTransform();
        return schemeTransform.init(options.transform, Promise.resolve({}));
      })
      .then((schemeTransform) => expect(schemeTransform)
        .toBeInstanceOf(testClass));
  });

  test('Class Construction with Plugin', () => {
    let testClass;
    expect.assertions(1);
    return SchemePunkTransformBase(options.transform.plugin)
      .then((SchemeTransform) => {
        testClass = SchemeTransform;
        const schemeTransform = new SchemeTransform();
        return schemeTransform.init(options.transform, Promise.resolve({}));
      })
      .then((schemeTransform) => expect(schemeTransform)
        .toBeInstanceOf(testClass));
  });

  test('TransformBase use transform method', () => {
    expect.assertions(1);
    return SchemePunkTransformBase(options.transform.plugin)
      .then((TransformSource) => {
        const transformSource = new TransformSource();
        return transformSource.init(options.transform, Promise.resolve({}))
          .then((transform) => Promise.all([transform, transform.transform({
            dumber: 'dumb'
          })]));
      })
      .then(([transformer]) => transformer.getTransformedValue())
      .then((transformedValue) => expect(transformedValue).toEqual(['dumber']));
  });
});
