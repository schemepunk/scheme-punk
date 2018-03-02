'use strict';

const Molotov = require('../molotov');

module.exports = function transformFactory(pluginName, molotovConfig = {overrides: {}, cocktailClasses: []}) { // eslint-disable-line max-len
  let setUp;
  const molotov = Molotov(molotovConfig);

  if (pluginName) {
    setUp = Promise.resolve(molotov.getMolotov().resolve().transform[pluginName]); // Ensures we get any superOverrides from config.
  }
  else {
    setUp = Promise.resolve(molotov.mixSupers().getMolotov().getSupers().transform);
  }

  return setUp.then(extendedClass => class schemePunkTransform extends extendedClass {
    init(schemeOptions, holdOvers, callPath) {
      return super.init(schemeOptions, holdOvers, callPath);
    }
    /*
     * Function to tranform a value, this is an implementing class and thus
     * calls super.transform() like a mixin.
     *
     * @param value
     *  A value to perform a transformation upon.
     */
    transform(value) {
      return super.transform(value)
        .then((xformedValue) => {
          this.value = xformedValue;
        });
    }
  });
};
