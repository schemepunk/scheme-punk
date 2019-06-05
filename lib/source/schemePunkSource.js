'use strict';

const Molotov = require('../molotov');

async function setUpPromise(pluginName, molotovConfig) {
  let setUp;
  const molotov = Molotov(molotovConfig);
  try {
    if (pluginName) {
      setUp = await molotov.getMolotov().resolve().source[pluginName]; // Ensures we get any superOverrides from config.
    }
    else {
      setUp = await molotov.mixSupers().getMolotov().getSupers().source;
    }
    if (!setUp) {
      let msg;
      msg = 'No source plugin was indicated but the source super was not found.'; // eslint-disable-line max-len
      if (pluginName) {
        msg = `A plugin named: ${pluginName}, was indicated in a scheme but does not exist as a source plugin.`; // eslint-disable-line max-len
      }
      throw Error(msg);
    }
    return setUp;
  }
  catch (error) {
    throw error;
  }
}

module.exports = async function sourceFactory(pluginName, molotovOptions = {overrides: {}, cocktailClasses: []}) { // eslint-disable-line max-len
  const extendedClass = await setUpPromise(pluginName, molotovOptions);

  return class schemePunkSource extends extendedClass {
    /**
     * init function for schemePunkSource.
     *
     * @param  obj options
     *   An options object to configure our source class.
     * @param  obj scheme
     *   A scheme punk scheme.
     * @param obj holdOvers
     *  Holdover values set in source that carry through to destination.
     *
     */
    init(options, scheme, holdOvers, callPath, templateObject) {
      return super.init(options, scheme, holdOvers, callPath, templateObject);
    }

    /**
       * Function to tranform a value, this is an implementing class and thus
       * calls super.transform() like a mixin.
       *
       * @param value
       *  A value to perform a transformation upon.
       */
    // Sets the origin. I.e. SchemePunkScheme, a file, a variable.
    setOrigin(value) {
      this.retrievedOrigin = value;
      // This will mostly be a pass through unless we have a file operation.
      super.setOrigin(value);
    }

    /**
       * setTarget - Sets the target within the source. Calls up to a super.
       *
       * @param
       *  targetValue
       */
    setTarget(targetValue) {
      this.schemePunkSourceTarget = targetValue;
      super.setTarget(targetValue);
    }

    /**
       * setHoldovers - sets holdOvers on src. If we have a src key
       *   inside of setHolders, we attempt to retrieve those values
       *   from the source and assign them to the holdovers.
       *
       * @param  obj holdOvers
       *   An object of holdOver keys for use with transforms and destinations.
       *
       */
    setHoldOvers(holdOverValues) {
      this.holdOvers = holdOverValues;
      super.setHoldOvers(holdOverValues);
    }
  };
};
