'use strict';

const Molotov = require('../molotov');

module.exports = function destinationFactory(pluginName, molotovConfig = {overrides: {}, cocktailClasses: []}) { // eslint-disable-line max-len
  let setUp;
  const molotov = Molotov(molotovConfig);
  if (pluginName) {
    setUp = molotov.getMolotov().resolve().destination[pluginName]; // Ensures we get any superOverrides from config.
  }
  else {
    setUp = molotov.mixSupers().getMolotov().getSupers().destination;
  }

  let msg;
  if (!setUp) {
    msg = `Destination was called with no plugins but the super did not exist in the supers Object.`; // eslint-disable-line max-len
    if (pluginName) {
      msg = `A destination plugin named: ${pluginName}, was called but did not exist in the destination Object.`; // eslint-disable-line max-len
    }
    return Promise.reject(new Error(msg));
  }

  return Promise.resolve(setUp).then(extendedClass => class schemePunkDestination extends extendedClass { // eslint-disable-line max-len
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
