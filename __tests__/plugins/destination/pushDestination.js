'use strict';

const PushDestination = require('../../../lib/plugins/destination/pushDestination');

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
const pushDestination = new (PushDestination(BaseDestination))();

describe('Push Destination Tests.', () => {
  test('Push destination into an Array.', () => {
    const testScheme = {
      test1: 'item',
      test2: [1],
      test3: 'item'
    };

    pushDestination.scheme = {
      originalScheme: testScheme,
      activeScheme: testScheme,
      newScheme: null
    };
    pushDestination.destination = 'activeScheme';
    pushDestination.target = 'test2';
    pushDestination.value = 'apple';
    pushDestination.writeDestinationTarget();
    expect(pushDestination.scheme.activeScheme.test2).toEqual([1, 'apple']);
  });

  test('Push destination into a string.', () => {
    const testScheme = {
      test1: 'item',
      test2: [1],
      test3: 'item'
    };

    pushDestination.scheme = {
      originalScheme: testScheme,
      activeScheme: testScheme,
      newScheme: null
    };
    pushDestination.destination = 'activeScheme';
    pushDestination.target = 'test1';
    pushDestination.value = 'apple';
    pushDestination.writeDestinationTarget();
    expect(pushDestination.scheme.activeScheme.test1).toEqual(['item', 'apple']);
  });
});
