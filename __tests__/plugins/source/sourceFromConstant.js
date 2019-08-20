'use strict';

class sourceBase {
  init(options) {
    this.options = options;
    return Promise.resolve(this);
  }

  getSchemePunkSourceTarget() {
    this.nothing = 'nothing';
  }

  setOrigin(origin) {
    this.origin = origin;
  }

  getOrigin() {
    return this.origin;
  }

  getHoldOvers() {
    return Promise.resolve(this.holdOvers);
  }

  setHoldOvers(holdover) {
    this.holdOvers = holdover;
  }
}

const sourceFromConstant = require('../../../lib/plugins/source/sourceFromConstant');

let mocks = [];

const goodOptionsArr = {
  constant: ['test']
};

const goodOptionsObj = {constant: {test: 'test'}};
const goodOptionsStr = {constant: 'test'};


describe('sourceFromConstant', () => {
  afterEach(() => {
    mocks.forEach((mock) => mock.mockRestore());
    mocks = [];
  });

  test('Can be instantiated array.', async () => {
    expect.assertions(1);
    mocks.push(jest.spyOn(sourceBase, 'constructor'));
    const source = new (sourceFromConstant(sourceBase))();
    return source.init(goodOptionsArr, {originalScheme: {}}, {})
      .then(async (sourcey) => {
        expect(await sourcey.getSource()).toEqual(['test']);
      });
  });
  test('Can be instantiated obj.', async () => {
    expect.assertions(1);
    mocks.push(jest.spyOn(sourceBase, 'constructor'));
    const source = new (sourceFromConstant(sourceBase))();
    return source.init(goodOptionsObj, {originalScheme: {}}, {})
      .then(async (sourcey) => {
        expect(await sourcey.getSource()).toEqual({test: 'test'});
      });
  });
  test('Can be instantiated Str.', async () => {
    expect.assertions(1);
    mocks.push(jest.spyOn(sourceBase, 'constructor'));
    const source = new (sourceFromConstant(sourceBase))();
    return source.init(goodOptionsStr, {originalScheme: {}}, {})
      .then(async (sourcey) => {
        expect(await sourcey.getSource()).toEqual('test');
      });
  });
});
