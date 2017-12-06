'use strict';

const MergeIntoDestination = require('../../../lib/plugins/destination/mergeIntoDestination');

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
const mergeIntoDestination = new (MergeIntoDestination(BaseDestination))();

describe('Merge into Destination Tests.', () => {
  test('Merge into destination.', () => {
    const testScheme = {
      test1: 'item',
      test2: 'item',
      test3: {
        that: 'this',
        even: 'dumb'
      }
    };

    mergeIntoDestination.scheme = {
      originalScheme: testScheme,
      activeScheme: testScheme,
      newScheme: null
    };
    mergeIntoDestination.destination = 'activeScheme';
    mergeIntoDestination.target = 'test3';
    mergeIntoDestination.value = {
      knope: 'leslie',
      perkins: 'ann'
    };
    mergeIntoDestination.writeDestinationTarget();
    expect(mergeIntoDestination.scheme.activeScheme.test3).toEqual({
      that: 'this',
      even: 'dumb',
      knope: 'leslie',
      perkins: 'ann'
    });
  });
});
