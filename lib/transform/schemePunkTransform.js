'use strict';

const Molotov = require('../molotov');

module.exports = function transformFactory(pluginName, molotovConfig = {overrides: {}, cocktailClasses: []}) { // eslint-disable-line max-len
  let setUp;
  const molotov = Molotov(molotovConfig);
  if (pluginName) {
    setUp = molotov.getMolotov().resolve().transform[pluginName]; // Ensures we get any superOverrides from config.
  }
  else {
    setUp = molotov.mixSupers().getMolotov().getSupers().transform;
  }

  let msg;
  if (!setUp) {
    msg = `Transform was called with no plugins but the super did not exist in the supers Object.`; // eslint-disable-line max-len
    if (pluginName) {
      msg = `A tranform plugin named: ${pluginName}, was called but did not exist in the transform Object.`; // eslint-disable-line max-len
    }
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(setUp).then(extendedClass => class schemePunkTransform extends extendedClass { // eslint-disable-line max-len
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
