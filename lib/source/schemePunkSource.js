'use strict';

const molotov = require('../molotov')();

module.exports = function sourceFactory(pluginName) {
  let setUp;

  if (pluginName) {
    setUp = molotov.getMolotov() // Ensures we get any superOverrides from config.
      .then(pluginMaker => pluginMaker.resolve())
      .then(resolved => resolved.source[pluginName]);
  }
  else {
    setUp = molotov.getSupers()
      .then(superClasses => superClasses.source);
  }

  return setUp.then(extendedClass => class schemePunkSource extends extendedClass {
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
    init(options, scheme, holdOvers) {
      super.init(options, scheme, holdOvers);
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
  });
};
