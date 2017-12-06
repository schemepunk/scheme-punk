'use strict';

const ConcatIntoDestination = require('../../../lib/plugins/destination/concatIntoDestination');

class BaseDestination {
  constructor(options) {
    this.options = options;
  }

  getTarget() {
    return this.target;
  }

  getValue() {
    return this.value;
  }

  getDestination() {
    return this.destination;
  }
}
const concatIntoDestination = new (ConcatIntoDestination(BaseDestination))();

describe('Concat into Destination Tests.', () => {
  test('Concat a value array into an existing scheme array.', () => {
    const testScheme = {
      test1: 'item',
      test2: 'item',
      test3: ['this', 'that', 'even', 'dumb']
    };

    concatIntoDestination.scheme = {
      originalScheme: testScheme,
      activeScheme: testScheme,
      newScheme: null
    };
    concatIntoDestination.destination = 'activeScheme';
    concatIntoDestination.target = 'test3';
    concatIntoDestination.value = ['knope', 'ron', 'ann'];
    concatIntoDestination.writeDestinationTarget();
    expect(concatIntoDestination.scheme.activeScheme.test3).toEqual(['this', 'that', 'even', 'dumb', 'knope', 'ron', 'ann']);
  });
});
