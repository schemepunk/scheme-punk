'use strict';

class sourceBase {
  init(options, scheme, holdOvers) {
    this.scheme = scheme;
    this.setOrigin(options.origin);
  }
  getSchemePunkSourceTarget() {}
  setOrigin() {}
  getOrigin() {}
  getHoldOvers() {}
}



class sourceBase2 {
  init(options, scheme, holdOvers) {
    this.scheme = scheme;
  }
  getSchemePunkSourceTarget() {}
  getOrigin() {
    return this.retrievedOrigin;
  }
  getHoldOvers() {}
}

const originalSchemeSource = require('../../../lib/plugins/source/originalSchemeSource');

let mocks = [];
const scheme = {
  originalScheme: {
    test1: 'testValue1',
    test2: 'testValue2',
  },
};

const holdOvers = {};

describe('contigentSource', () => {
  afterEach(() => {
    mocks.forEach(mock => mock.mockRestore());
    mocks = [];
  });

  test('Original Scheme Source calls super.', () => {
    expect.assertions(1);
    mocks.push(jest.spyOn(sourceBase.prototype, 'setOrigin'));
    const source = new (originalSchemeSource(sourceBase));
    source.init({}, scheme, holdOvers);
    expect(sourceBase.prototype.setOrigin).toBeCalledWith({test1: 'testValue1', test2: 'testValue2'});
  });

  test('Original Scheme source no super.', () => {
    expect.assertions(1);
    const source = new (originalSchemeSource(sourceBase2));
    source.init({}, scheme, holdOvers);
    source.setOrigin();
    expect(source.getOrigin()).toEqual({test1: 'testValue1', test2: 'testValue2'});
  });
});
