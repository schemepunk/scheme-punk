'use strict';

const Destination = require('./schemePunkDestination');
const _ = require('lodash');
const schemePunkTransformBase = require('./transform/schemePunkTransformBase');
const schemePunkSource = require('./source/schemePunkSource')

module.exports = class schemePunk {
  constructor(options){
    // Let's get this going.
    // We need to know what we are grabbing.
    // this.options.source.
    // We need to know where its going
    // this.options.destination
    // Eventually we will need to know what kind of transform we are doing.
    // but for now we will do the same.
      this.options = options;

    //this.transformType = options.transformType;
  }
  enhance(schemePunkScheme){

    return new Promise((resolve, reject) => {
      // Get the item at source.

      // source options
      var sourceOptions = {
        source: {
          source: schemePunkScheme.originalScheme,
          type: 'object',
          target: this.options.source
        }
      };

      // Create a new schemePunk source instance.
      var schemeSource = new schemePunkSource(sourceOptions);

      schemeSource.setSource();
      var source = schemeSource.getSource();

      // Create fake options for now.
      var transformerOptions = 'objectKeysTransform';

      var schemeTransformer = schemePunkTransformBase({}, transformerOptions);
      // Here is an instance of schemeTransformer.
      var atransformer = new schemeTransformer();

      atransformer.transform(source);

      var bit = atransformer.getTransformedValue();

      // return the scheme
      _.set(schemePunkScheme.newScheme, this.options.destination, bit);
      // later we will want to operate on an object, one with the original and
      // the other the new.
      resolve(schemePunkScheme);
      // if not return reject.
    });
  }
}
