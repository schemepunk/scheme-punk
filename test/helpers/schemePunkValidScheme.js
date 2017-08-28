'use strict';

module.exports = {
  aribitraryName: [
    [
      {
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
      }
    ],
    [
      {
        source: {
          target: 'properties.data.properties.attributes.properties',
          plugin: 'originalSchemeSource'
        },
        transform: {
          plugin: 'filterAttributeMulti',
          filterItems: [
            'one',
            'two',
            'three'
          ],
          filterBias: 'out',
          typeAdapterObjectValues: true
        },
        destination: {
          target: 'properties.data.properties.attributes.properties'
        }
      }
    ]
  ]
};

