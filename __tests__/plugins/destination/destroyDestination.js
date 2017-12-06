'use strict';

const _ = require('lodash');
const DestroyDestination = require('../../../lib/plugins/destination/destroyDestination');

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
const destroyDestination = new (DestroyDestination(BaseDestination))();

describe('Destroy Destination Tests.', () => {
  test('Destroy target.', () => {
    const testScheme = {
      test1: 'item',
      test2: 'item',
      test3: 'item'
    };

    destroyDestination.scheme = {
      originalScheme: testScheme,
      activeScheme: testScheme,
      newScheme: null
    };
    destroyDestination.destination = 'activeScheme';
    destroyDestination.target = 'test2';
    destroyDestination.writeDestinationTarget();
    expect(_.has(destroyDestination, 'scheme.activeScheme.test2')).toBeFalsy();
  });
});
