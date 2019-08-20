'use strict';

class sourceBase {
  init(options, scheme) {
    this.scheme = scheme;
    this.setOrigin(options.origin);
  }

  getSchemePunkSourceTarget() {} // eslint-disable-line class-methods-use-this

  setOrigin() {} // eslint-disable-line class-methods-use-this

  getOrigin() {} // eslint-disable-line class-methods-use-this

  getHoldOvers() {} // eslint-disable-line class-methods-use-this
}

class sourceBase2 {
  init(options, scheme) {
    this.scheme = scheme;
  }

  getSchemePunkSourceTarget() {} // eslint-disable-line class-methods-use-this

  getOrigin() {
    return this.retrievedOrigin;
  }

  getHoldOvers() {} // eslint-disable-line class-methods-use-this
}

const activeSchemeSource = require('../../../lib/plugins/source/activeSchemeSource');

let mocks = [];
const scheme = {
  originalScheme: {
    test1: 'testValue1',
    test2: 'testValue2'
  },
  activeScheme: {
    test1: 'activeTestValue1',
    test2: 'activeTestValue2'
  }
};

const holdOvers = {};

describe('activeSchemeSource', () => {
  afterEach(() => {
    mocks.forEach((mock) => mock.mockRestore());
    mocks = [];
  });

  test('Active Scheme Source calls super.', () => {
    expect.assertions(1);
    mocks.push(jest.spyOn(sourceBase.prototype, 'setOrigin'));
    const source = new (activeSchemeSource(sourceBase)); // eslint-disable-line new-parens
    source.init({}, scheme, holdOvers);
    expect(sourceBase.prototype.setOrigin).toBeCalledWith({
      test1: 'activeTestValue1',
      test2: 'activeTestValue2'
    });
  });

  test('Active Scheme source no super.', () => {
    expect.assertions(1);
    const source = new (activeSchemeSource(sourceBase2)); // eslint-disable-line new-parens
    source.init({}, scheme, holdOvers);
    source.setOrigin();
    expect(source.getOrigin()).toEqual({
      test1: 'activeTestValue1',
      test2: 'activeTestValue2'
    });
  });
});
