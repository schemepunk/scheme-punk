'use strict';

const Molotov = require('../molotov');

module.exports = function destinationFactory(pluginName, molotovConfig = {overrides: {}, cocktailClasses: []}) { // eslint-disable-line max-len
  let setUp;
  const molotov = Molotov(molotovConfig);
  if (pluginName) {
    setUp = Promise.resolve(molotov.getMolotov().resolve().destination[pluginName]); // Ensures we get any superOverrides from config.
  }
  else {
    setUp = Promise.resolve(molotov.mixSupers().getMolotov().getSupers().destination);
  }

  return setUp.then(extendedClass => class schemePunkDestination extends extendedClass {
    init(options, transformedValue, scheme, holdOvers, callPath) {
      return super.init(options, transformedValue, scheme, holdOvers, callPath);
    }
    /**
     * Here for mixins.
     */
    writeDestinationTarget() {
      super.writeDestinationTarget();
    }
  });
};
