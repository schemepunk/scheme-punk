'use strict';

const molotov = require('../molotov')();

module.exports = function destinationFactory(pluginName) {
  let setUp;

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
    init(options, transformedValue, scheme, holdOvers) {
      return super.init(options, transformedValue, scheme, holdOvers);
    }
    /**
     * Here for mixins.
     */
    writeDestinationTarget() {
      super.writeDestinationTarget();
    }
  });
};
