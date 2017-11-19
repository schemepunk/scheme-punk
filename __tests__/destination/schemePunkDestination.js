'use strict';

const SchemePunkDestinationBase = require('../../lib/destination/schemePunkDestination');
const options = require('./../__helpers__/schemePunkTestOptions');

let tmpMocks = [];
let transformedValue;
let scheme;
let holdOvers;

beforeEach(() => {
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
  transformedValue = 'testValue';
  scheme = {
    links: [
      {
        scheme: {
          properties: {
            fields: {
              enum: 'value'
            }
          }
        }
      }
    ]
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Scheme Punk Destination', () => {
  test('Class Construction', () => {
    let testClass;
    expect.assertions(1);
    return SchemePunkDestinationBase()
      .then((SchemeDestination) => {
        testClass = SchemeDestination;
        const schemeDestination = new SchemeDestination();
        schemeDestination.init(options.destination, transformedValue, scheme, holdOvers);
        return schemeDestination;
      })
      .then(schemeDestination => expect(schemeDestination)
        .toBeInstanceOf(testClass));
  });

  test('Class Construction with Plugin', () => {
    let testClass;
    expect.assertions(1);
    return SchemePunkDestinationBase({plugin: 'destroyDestination'})
      .then((SchemeDestination) => {
        testClass = SchemeDestination;
        const schemeDestination = new SchemeDestination();
        schemeDestination.init(options.destination, transformedValue, scheme, holdOvers);
        return schemeDestination;
      })
      .then(schemeDestination => expect(schemeDestination)
        .toBeInstanceOf(testClass));
  });

  test('TransformBase use write Destination', () => {
    expect.assertions(1);
    return SchemePunkDestinationBase()
      .then((DestinationSource) => {
        const destinationSource = new DestinationSource();
        destinationSource.init(options.destination, transformedValue, scheme, holdOvers);
        return Promise.all([destinationSource, destinationSource.writeDestinationTarget()]);
      })
      .then(([destination]) => destination.getScheme())
      .then(schemes => expect(schemes.newScheme.links[0].schema.properties.fields.enum).toEqual(['testValue']));
  });
});
