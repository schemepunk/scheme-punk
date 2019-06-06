'use strict';

const Molotov = require('../molotov');

async function setUpPromise(pluginName, molotovConfig) {
  let setUp;
  let msg;
  const molotov = Molotov(molotovConfig);
  try {
    if (pluginName) {
      // Ensures we get any superOverrides from config.
      setUp = await molotov.getMolotov().resolve().transform[pluginName];
      // eslint-disable-next-line max-len
      msg = `A tranform plugin named: ${pluginName}, was called but did not exist in the transform Object.`;
    }
    else {
      setUp = await molotov.mixSupers().getMolotov().getSupers().transform;
      // eslint-disable-next-line max-len
      msg = `Transform was called with no plugins but the super did not exist in the supers Object.`;
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
