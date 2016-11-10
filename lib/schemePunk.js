'use strict';

const _ = require('lodash');
const schemePunkTransformBase = require('./transform/schemePunkTransformBase');
const SchemePunkSource = require('./source/schemePunkSource');

module.exports = class schemePunk {
  constructor(options) {
    // Let's get this going.
    // We need to know what we are grabbing.
    // this.options.source.
    // We need to know where its going
    // this.options.destination
    // Eventually we will need to know what kind of transform we are doing.
    // but for now we will do the same.
    this.options = options;
    // this.transformType = options.transformType;
  }
  enhance(schemePunkScheme) {
    return new Promise((resolve, reject) => {
      try {

        // Create a new schemePunk source instance.
        const schemeSource = new SchemePunkSource(this.options.source, schemePunkScheme);

        schemeSource.setSource();
        const source = schemeSource.getSource();

        // Create the transformation mixin assocatied with this transform key.
        const SchemeTransformer = schemePunkTransformBase({}, this.options.transform.plugin);
        // Here is an instance of schemeTransformer.
        const atransformer = new SchemeTransformer();
        // Run the transformer
        atransformer.transform(source);
        // Get the transformed value.
        const bit = atransformer.getTransformedValue();

        // return the scheme
        _.set(schemePunkScheme.newScheme, this.options.destination.target, bit);
        // later we will want to operate on an object, one with the original and
        // the other the new.
        resolve(schemePunkScheme);
        // if not return reject.
      }
      catch (err) {
        reject(err);
      }
    });
  }
};
