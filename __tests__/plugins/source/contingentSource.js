'use strict';

class sourceBase {
  init() {
    return Promise.resolve(this);
  }

  getSchemePunkSourceTarget() {
    this.nothing = 'nothing';
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

class sourceBase2 {
  constructor(options, scheme) {
    this.scheme = scheme;
  }
}

class sourceBase3 {
  init(options, scheme) {
    this.scheme = scheme;
    return Promise.resolve(this);
  }

  getSchemePunkSourceTarget() {
    return this.schemePunkSourceTarget;
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

  setOrigin(origin) {
    this.origin = origin;
  }
}

class sourceBase4 {
  init(options, scheme) {
    this.scheme = scheme;
    this.schemePunkSourceTarget = options.target;
    return Promise.resolve(this);
  }

  getSchemePunkSourceTarget() {
    return Promise.resolve(this.schemePunkSourceTarget);
  }

  getOrigin() {
    this.nothing = '';
  }

  getHoldOvers() {
    return Promise.resolve(this.holdOvers);
  }

  setHoldOvers(holdover) {
    this.holdOvers = holdover;
  }
}

const mockRequestFn = jest.fn();
jest.mock('request', () => ({
  defaults() {
    return mockRequestFn;
  },
}));

const contingentSource = require('../../../lib/plugins/source/contingentSource');

let mocks = [];
const scheme = {
  originalScheme: {
    test1: 'testValue1',
    test2: 'testValue2',
    testValue1: 'what'
  },
};

const goodOptions = {
  target: 'test1',
  contingencies: {
    testValue1: [
      {
        type: 'dynamic',
        path: 'newTest',
        target: 'testValue1',
      },
      {
        type: 'static',
        value: 'staticTest',
        path: 'type',
      },
      {
        type: 'holdOver',
        path: 'holdOverTest',
        holdover: {
          type: 'static',
          value: 'test2'
        },
      },
    ],
    defined: [
      {
        type: 'static',
        value: 'staticTestDefined',
        path: 'type',
      },
    ],
    undefined: [
      {
        type: 'static',
        value: 'staticTestUndefined',
        path: 'type',
      },
    ],
  },
};

const goodOptions2 = {
  target: 'test1',
  reducer: 'newTest',
  contingencies: {
    testValue1: [
      {
        type: 'dynamic',
        path: 'newTest',
        target: 'testValue1',
      },
      {
        type: 'static',
        value: 'staticTest',
        path: 'type',
      },
      {
        type: 'holdOver',
        path: 'holdOverTest',
        holdover: {
          type: 'static',
          value: 'test2'
        },
      },
    ],
    defined: [
      {
        type: 'static',
        value: 'staticTestDefined',
        path: 'type',
      },
    ],
    undefined: [
      {
        type: 'static',
        value: 'staticTestUndefined',
        path: 'type',
      },
    ],
  },
};

const holdOvers = {};

describe('contingentSource', () => {
  afterEach(() => {
    mocks.forEach((mock) => mock.mockRestore());
    mocks = [];
  });

  test('Can be instantiated.', () => {
    expect.assertions(2);
    mocks.push(jest.spyOn(sourceBase, 'constructor'));
    const source = new (contingentSource(sourceBase))();
    return source.init({contingencies: {test: []}, reducer: 'testReducer'}, {originalScheme: {}}, {})
      .then((sourcey) => {
        expect(sourcey.getContingencies()).toEqual({test: []});
        expect(sourcey.getReducer()).toEqual('testReducer');
      });
  });

  test('No reducer returns false.', () => {
    expect.assertions(1);
    mocks.push(jest.spyOn(sourceBase, 'constructor'));
    const source = new (contingentSource(sourceBase))();
    return source.init({contingencies: {test: []}}, {originalScheme: {}}, {})
      .then((sourcey) => expect(sourcey.getReducer()).toBe(false));
  });

  test('No Contingencies throws.', () => {
    expect.assertions(1);
    const source = new (contingentSource(sourceBase))();
    return source.init({contingencies: 'narf'}, {originalScheme: {}}, {})
      .catch((e) => expect(e).toBeInstanceOf(Error));
  });

  test('Non contigencies object throws.', () => {
    expect.assertions(1);
    const source = new (contingentSource(sourceBase))();
    return source.init({contingencies: {}}, {originalScheme: {}}, {})
      .catch((e) => expect(e).toBeInstanceOf(Error));
  });

  test('Get Switches.', () => {
    expect.assertions(1);
    const source = new (contingentSource(sourceBase))();
    return source.init({contingencies: {test: 'testValue'}}, {originalScheme: {}}, {})
      .then((sourcey) => expect(sourcey.getSwitches('test')).toBe('testValue'));
  });

  test('Get Switches no value returns false.', () => {
    expect.assertions(1);
    const source = new (contingentSource(sourceBase))();
    return source.init({contingencies: {test: 'testValue'}}, {originalScheme: {}}, {})
      .then((sourcey) => expect(sourcey.getSwitches('notThere')).toBe(false));
  });

  test('Get Switches by type defined.', () => {
    expect.assertions(1);
    const source = new (contingentSource(sourceBase))();
    mocks.push(jest.spyOn(sourceBase.prototype, 'getSchemePunkSourceTarget').mockReturnValue(Promise.resolve('test1')));
    mocks.push(jest.spyOn(sourceBase.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => sourcey.getSwitchByType())
      .then((switches) => expect(switches).toBe(goodOptions.contingencies.testValue1));
  });

  test('Get Switches by type exists.', () => {
    expect.assertions(1);
    const source = new (contingentSource(sourceBase))();
    mocks.push(jest.spyOn(sourceBase.prototype, 'getSchemePunkSourceTarget').mockReturnValue(Promise.resolve('test2')));
    mocks.push(jest.spyOn(sourceBase.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => sourcey.getSwitchByType())
      .then((switches) => expect(switches).toBe(goodOptions.contingencies.defined));
  });

  test('Get Switches by undefined.', () => {
    expect.assertions(1);
    const source = new (contingentSource(sourceBase))();
    mocks.push(jest.spyOn(sourceBase.prototype, 'getSchemePunkSourceTarget').mockReturnValue(Promise.resolve('test3')));
    mocks.push(jest.spyOn(sourceBase.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => sourcey.getSwitchByType())
      .then((switches) => expect(switches).toBe(goodOptions.contingencies.undefined));
  });

  test('set Contigencies throws.', () => {
    const source = new (contingentSource(sourceBase))();
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => sourcey.setContingencies('snarf'))
      .catch((e) => expect(e).toBeInstanceOf(Error));
  });

  test('Get Source no Switches.', () => {
    const badOptions = {...goodOptions};
    delete badOptions.contingencies.undefined;
    mocks.push(jest.spyOn(sourceBase.prototype, 'getSchemePunkSourceTarget').mockReturnValue(Promise.resolve('test4')));
    mocks.push(jest.spyOn(sourceBase.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    const source = new (contingentSource(sourceBase))();
    return source.init(badOptions, scheme, holdOvers)
      .then((sourcey) => sourcey.getSource())
      .then((sourcec) => expect(sourcec).toBeUndefined());
  });

  test('Set Product Holdovers contigent.', () => {
    const differentOptions = {...goodOptions};
    differentOptions.contingencies.testValue1[2].holdover.type = 'contingent';
    differentOptions.contingencies.testValue1[2].holdover.path = 'test2';
    mocks.push(jest.spyOn(sourceBase.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    const source = new (contingentSource(sourceBase))();
    return source.init(differentOptions, scheme, holdOvers)
      .then((sourcey) => Promise.all([
        sourcey,
        sourcey.setProductHoldovers({
          contingencySource: {
            test2: 'contigentTest',
          },
          tmpHoldOvers: {
            holdOverTest: differentOptions.contingencies.testValue1[2].holdover,
          },
        }),
      ]))
      .then(([sourcef]) => sourcef.getHoldOvers())
      .then((holds) => expect(holds).toEqual({holdOverTest: 'contigentTest'}));
  });

  test('Set Product Holdovers dynamic.', () => {
    mocks.push(jest.spyOn(sourceBase.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    const source = new (contingentSource(sourceBase))();
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => Promise.all([
        sourcey,
        sourcey.setProductHoldovers({
          contingencySource: {
            test2: 'contigentTest',
          },
          tmpHoldOvers: {
            holdOverTest: {
              type: 'dynamic',
              path: 'test1',
            },
          },
        }),
      ]))
      .then(([sourcef]) => sourcef.getHoldOvers())
      .then((holds) => expect(holds).toEqual({holdOverTest: 'testValue1'}));
  });

  test('Set Product Holdovers static.', () => {
    mocks.push(jest.spyOn(sourceBase.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    const source = new (contingentSource(sourceBase))();
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => Promise.all([
        sourcey,
        sourcey.setProductHoldovers({
          contingencySource: {
            test2: 'contigentTest',
          },
          tmpHoldOvers: {
            holdOverTest: {
              type: 'static',
              value: 'test2',
            },
          },
        }),
      ]))
      .then(([sourcef]) => sourcef.getHoldOvers())
      .then((holds) => expect(holds).toEqual({holdOverTest: 'test2'}));
  });

  test('Set Product Holdovers but no holdovers', () => {
    mocks.push(jest.spyOn(sourceBase.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    const source = new (contingentSource(sourceBase))();
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => Promise.all([
        sourcey,
        sourcey.setProductHoldovers({
          contingencySource: {
            test2: 'contigentTest',
          },
          tmpHoldOvers: {},
        }),
      ]))
      .then(([sourcef]) => sourcef.getHoldOvers())
      .then((holds) => expect(holds).toEqual({}));
  });

  test('Get Contigency Products', () => {
    mocks.push(jest.spyOn(sourceBase4.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    const source = new (contingentSource(sourceBase4))();
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => Promise.all([
        sourcey,
        sourcey.getSwitchByType()
      ]))
      .then(([thing1, thing2]) => Promise.all([thing1, thing1.getContingencyProducts(thing2)]))
      .then((products) => expect(products[1]).toEqual({
        contingencySource: {
          newTest: 'what',
          type: 'staticTest',
        },
        tmpHoldOvers: {
          holdOverTest: {
            path: 'test2',
            type: 'contingent',
            value: 'test2',
          },
        },
      }));
  });


  test('Get Switches.', () => {
    expect.assertions(1);
    const source = new (contingentSource(sourceBase2))({contingencies: {test: 'testValue'}}, scheme, {});

    source.setOrigin();
    expect(source.retrievedOrigin).toEqual(scheme.originalScheme);
  });

  test('set Origin Super call.', () => {
    expect.assertions(1);
    mocks.push(jest.spyOn(sourceBase3.prototype, 'setOrigin'));
    const source = new (contingentSource(sourceBase3))();
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => {
        sourcey.setOrigin();
        return expect(sourceBase3.prototype.setOrigin).toHaveBeenCalled();
      });
  });

  test('Source Plugin full test', () => {
    mocks.push(jest.spyOn(sourceBase4.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    const source = new (contingentSource(sourceBase4))();
    return source.init(goodOptions, scheme, holdOvers)
      .then((sourcey) => Promise.all([
        sourcey,
        sourcey.getSource()
      ]))
      .then((sourceResults) => expect(sourceResults[1]).toEqual({
        newTest: 'what',
        type: 'staticTest',
      }));
  });

  test('Source Plugin full test with reducer', () => {
    mocks.push(jest.spyOn(sourceBase4.prototype, 'getOrigin').mockReturnValue(Promise.resolve(scheme.originalScheme)));
    const source = new (contingentSource(sourceBase4))();
    return source.init(goodOptions2, scheme, holdOvers)
      .then((sourcey) => Promise.all([
        sourcey,
        sourcey.getSource()
      ]))
      .then((sourceResults) => expect(sourceResults[1]).toBe('what'));
  });
});
