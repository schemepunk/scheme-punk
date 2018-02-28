'use strict';

const Molotov = require('../molotov');

module.exports = function transformFactory(pluginName, molotovConfig) {
  let setUp;
  const molotov = Molotov(molotovConfig);

  if (pluginName) {
    setUp = molotov.getMolotov() // Ensures we get any superOverrides from config.
      .then(pluginMaker => pluginMaker.resolve())
      .then(resolved => resolved.transform[pluginName]);
  }
  else {
    setUp = molotov.getSupers()
      .then(superClasses => superClasses.transform);
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
