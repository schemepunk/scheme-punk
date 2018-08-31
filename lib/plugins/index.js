'use strict';

const concatIntoDestination = require('./destination/concatIntoDestination');
const destroyDestination = require('./destination/destroyDestination');
const mergeIntoDestination = require('./destination/mergeIntoDestination');
const pushDestination = require('./destination/pushDestination');
const activeSchemeSource = require('./source/activeSchemeSource');
const jsonTemplateFileSource = require('./source/jsonTemplateFileSource');
const originalSchemeSource = require('./source/originalSchemeSource');
const appendValues = require('./transform/appendValues');
const delimitValues = require('./transform/delimitValues');
const filterAttributes = require('./transform/filterAttributes');
const filterObjects = require('./transform/filterObjects');
const objectKeysTransform = require('./transform/objectKeysTransform');
const prependValues = require('./transform/prependValues');
const regexWordBoundariesValues = require('./transform/regexWordBoundariesValues');
const tokenTemplateValues = require('./transform/tokenTemplateValues');
const typeAdapter = require('./transform/typeAdapter');

const plugins = {
  destination: {
    concatIntoDestination,
    destroyDestination,
    mergeIntoDestination,
    pushDestination
  },
  source: {
    activeSchemeSource,
    jsonTemplateFileSource,
    originalSchemeSource
  },
  transform: {
    appendValues,
    delimitValues,
    filterAttributes,
    filterObjects,
    objectKeysTransform,
    prependValues,
    regexWordBoundariesValues,
    tokenTemplateValues,
    typeAdapter
  }
};

module.exports = plugins;
