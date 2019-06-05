'use strict';

const Molotov = require('../molotov');

async function setUpPromise(pluginName, molotovConfig) {
  let setUp;
  const molotov = Molotov(molotovConfig);
  try {
    if (pluginName) {
      setUp = await molotov.getMolotov().resolve().transform[pluginName]; // Ensures we get any superOverrides from config.
    }
    else {
      setUp = await molotov.mixSupers().getMolotov().getSupers().transform;
    }
    if (!setUp) {
      let msg;
      msg = `Transform was called with no plugins but the super did not exist in the supers Object.`; // eslint-disable-line max-len
      if (pluginName) {
        msg = `A tranform plugin named: ${pluginName}, was called but did not exist in the transform Object.`; // eslint-disable-line max-len
      }
      throw Error(msg);
    }
    return setUp;
  }
  catch (error) {
    throw error;
  }
}

module.exports = async function transformFactory(pluginName, molotovOptions = {overrides: {}, cocktailClasses: []}) { // eslint-disable-line max-len
  const extendedClass = await setUpPromise(pluginName, molotovOptions);

  return class schemePunkTransform extends extendedClass { // eslint-disable-line max-len
    init(schemeOptions, holdOvers, callPath, templateObject) {
      return super.init(schemeOptions, holdOvers, callPath, templateObject);
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
          return this.value;
        });
    }
  };
};
