'use strict';

const fs = require('fs-extra');
const path = require('path');
const stack = require('callsite');
const mustache = require('mustache');

/**
 * This is a transformation mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 * Options needed for use with this mixin.
 * options array
 *   options.origin string
 *     A path to a template file, a template literal string.
 *   options.named boolean
 *     True if you are using options.tokens for values and false for this.value.
 *     Named attributes allows us a further transformation of the value from
 *     origin. So we have two paths forward then, either take the value as it
 *     is, no matter its' shape, string, array, obj, whatever and use it with
 *     the appropriate attributes or indexes (where applicable) or map it to a
 *     name in the tokens object/array.
 *   options.tokens object || array
 *     A pass through value that can either be an array or an object to use with
 *     template replacements.
 *
 */
module.exports = superclass => class extends superclass {
  /**
   * Function to transform a value by prepending a string to a key, array member
   * or string. This.options will need a prependValue in order to work with
   * this transform.
   *
   * @param value
   *  A value to perform a transformation upon.
   */
  /* eslint class-methods-use-this:
  ["error", { "exceptMethods": ["getTraceIndex"] }]
  */
  transform(value) {
    let tmpValue = value;
    if (typeof tmpValue !== 'object') {
      tmpValue = {value: value};// eslint-disable-line object-shorthand
    }
    // Set up variables.
    // Are we using named values?
    let tokens = {}; // eslint-disable-line no-unused-vars
    if (Object.keys(this.getHoldOvers()).length) {
      // If we have any holdovers let's merge them into tokens;
      tokens = Object.assign({}, tokens, this.getHoldOvers());
    }

    if (this.options.named) {
      const tmpTokens = this.options.tokens;
      // We are using tokens, which are reassignments of values to new names.
      for (let i = 0; i < Object.keys(tmpTokens).length; i += 1) {
        // We need to get the values and assign them to their new names.
        tmpTokens[Object.keys(tmpTokens)[i]] = tmpValue[tmpTokens[Object.keys(tmpTokens)[i]]];
      }
      tokens = Object.assign({}, tokens, tmpTokens);
    }
    else {
      // we are not using tokens.
      tokens = Object.assign({}, tokens, tmpValue);
    }
    const templatePath = this.getTemplatePath(this.options.origin);

    const tmpFile = fs.readFileSync(templatePath, 'utf-8').replace(/\\"/g, '"');

    if (this.options.json) {
      return super.transform(JSON.parse(mustache.render(tmpFile, tokens)));
    }

    if (this.options.unescape) {
      return super.transform(mustache.render(tmpFile, tokens).replace(/\\"/g, '"'));
    }

    return super.transform(mustache.render(tmpFile, tokens));
  }

  getTemplatePath(value) {
    // Use callsite to resolve path from calling script.
    const base = require.resolve('../../../');
    const stackTrace = stack().reverse();
    let traceIndex = stackTrace.findIndex(
      trace => trace.getFileName() === base
    );
    traceIndex = this.getTraceIndex(traceIndex);

    return path.resolve(
      path.dirname(stackTrace[traceIndex].getFileName()),
      value
    );
  }

  getTraceIndex(index) {
    if (index > 0) {
      return index - 1;
    }
    return 0;
  }
};

