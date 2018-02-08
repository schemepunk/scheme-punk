'use strict';

const _ = require('lodash');
const DestroyDestination = require('../../../lib/plugins/destination/destroyDestination');
const BaseDestination = require('../../__helpers__/BaseDestination');

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
