'use strict';

module.exports = {
  source: {
    target: 'properties.data.properties.attributes.properties',
    plugin: 'originalSchemeSource'
  },
  destination: {
    target: 'links[0].schema.properties.fields.enum'
  },
  transform: {
    plugin: 'objectKeysTransform'
  }
};
