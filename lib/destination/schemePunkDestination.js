'use strict';

const Molotov = require('../molotov');

module.exports = function destinationFactory(pluginName, molotovConfig) { // eslint-disable-line max-len
  let setUp;
  const molotov = Molotov(molotovConfig);
  if (pluginName) {
    setUp = molotov.getMolotov() // Ensures we get any superOverrides from config.
      .then(pluginMaker => pluginMaker.resolve())
      .then(resolved => resolved.destination[pluginName]);
  }
  else {
    setUp = molotov.getSupers()
      .then(superClasses => superClasses.destination);
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
