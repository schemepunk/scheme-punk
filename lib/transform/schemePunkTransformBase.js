'use strict';

// Using config module with this module's default config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
const config = require('config');
const schemePunkTransformer = require('./schemePunkTransform');
const transformConfig = require('./../schemePunkPluginLoader');

module.exports =
  function(configs, transformOptions) {
    // Configs can be passed in from configs to instantiate
    // Transform options gives us the key to the mixins we are going to extend.

    // Mixin configs that have been passed in, and make those my defaults
    config.util.extendDeep(transformConfig, configs);
    config.util.setModuleDefaults('schemePunkTranformDefault', transformConfig);

   //[ ] TODO: Figure out how to return a not extended version of this class.

    /**
     * We see that we need to return this class with a mixin capability.
     * This is a mixin approach described here:
     * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
     * This approach give us:
     * 1) Subclasses which can override mixin methods.
     * 2) a working super()
     * 3) Composition is preserved if all implementing methods call super.
     * Our transform base extends our config object which included all of the plugins.
     * It also implements key elements of the schemePunkTransform class.
     */
    return class schemePunkTransformBase extends transformConfig.transformPlugins[transformOptions]  {
      /**
       * Function to tranform a value, this is an implementing class and thus
       * calls super.transform() like a mixin.
       *
       * @param value
       *  A value to perform a transformation upon.
       */
      transform(value){
        super.transform(value);
      }
    }
  }
