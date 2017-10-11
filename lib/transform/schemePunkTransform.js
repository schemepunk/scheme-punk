'use strict';

const molotov = require('../molotov')();

module.exports = function transformFactory(pluginName) {
  let setUp;

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
      init(schemeOptions, holdOvers) {
        super.init(schemeOptions, holdOvers);
      }
      /**
       * Function to tranform a value, this is an implementing class and thus
       * calls super.transform() like a mixin.
       *
       * @param value
       *  A value to perform a transformation upon.
       */
      transform(value) {
        this.value = super.transform(value);
      }
  });
}
