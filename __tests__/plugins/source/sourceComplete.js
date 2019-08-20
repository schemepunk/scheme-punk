'use strict';

class sourceBase {
  init(options, scheme) {
    this.setScheme(scheme);
    return Promise.resolve(this);
  }

  setOrigin(origin) {
    this.retrievedOrigin = origin;
  }

  setScheme(scheme) {
    this.scheme = scheme;
  }

  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
  }

  getOrigin() {
    return this.retrievedOrigin;
  }

  getHoldOvers() {
    return Promise.resolve(this.holdOvers);
  }

  setHoldOvers(holdover) {
    this.holdOvers = holdover;
  }
}

const sourceComplete = require('../../../lib/plugins/source/sourceComplete');

let mocks = [];

const testScheme = {
  data: {
    attributes: {
      test: 'one',
      test2: 'two',
    },
  },
};

const testSchemePlus = {
  data: {
    attributes: {
      test: 'onePlus',
      test2: 'twoPlus',
    },
  },
};

const scheme = {
  originalScheme: testScheme,
  activeScheme: testSchemePlus,
  newScheme: null,
};

const options = {
  plugin: 'sourceComplete',
  origin: 'activeScheme',
};

describe('sourceComplete', () => {
  afterEach(() => {
    mocks.forEach((mock) => mock.mockRestore());
    mocks = [];
  });

  test('Can be instantiated.', () => {
    expect.assertions(1);
    mocks.push(jest.spyOn(sourceBase, 'constructor'));
    const source = new (sourceComplete(sourceBase))();
    return source.init(options, scheme)
      .then((sourcey) => Promise.all([sourcey, sourcey.setOrigin()]))
      .then(([sources]) => sources.getSource())
      .then((sourcef) => expect(sourcef).toBe());
  });
});
