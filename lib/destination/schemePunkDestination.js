'use strict';

const Molotov = require('../molotov');

async function setUpPromise(pluginName, molotovConfig) {
  let setUp;
  let msg;
  const molotov = Molotov(molotovConfig);
  try {
    if (pluginName) {
      setUp = await molotov.getMolotov().resolve().destination[pluginName]; // Ensures we get any superOverrides from config.
      msg = `A destination plugin named: ${pluginName}, was called but did not exist in the destination Object.`; // eslint-disable-line max-len
    }
    else {
      setUp = await molotov.mixSupers().getMolotov().getSupers().destination;
      msg = `Destination was called with no plugins but the super did not exist in supers Object.`; // eslint-disable-line max-len
    }
    if (!setUp) {
      throw Error(msg);
    }
    return setUp;
  }
  catch (error) {
    throw error;
  }
}

module.exports = async function destinationFactory(pluginName, molotovOptions = {overrides: {}, cocktailClasses: []}) { // eslint-disable-line max-len
  const extendedClass = await setUpPromise(pluginName, molotovOptions);

  return class schemePunkDestination extends extendedClass { // eslint-disable-line max-len
    init(options, transformedValue, scheme, holdOvers, callPath, templateObject) {
      return super.init(options, transformedValue, scheme, holdOvers, callPath, templateObject);
    }

    /**
     * Here for mixins.
     */
    writeDestinationTarget() {
      return super.writeDestinationTarget();
    }
  };
};
