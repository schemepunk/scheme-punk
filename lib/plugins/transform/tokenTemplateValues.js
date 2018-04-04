'use strict';

const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const _ = require('lodash');

const FILE_CACHE = {};

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
   * Helper method to get a file's contents either from cache or from fs.
   *
   * @param {string} templatePath
   *   The path to the file to get.
   *
   * @return {Promise<string>}
   *   Resolves with the contents of the file.
   */
  static _getFile(templatePath) {
    if (FILE_CACHE[templatePath]) {
      return Promise.resolve(FILE_CACHE[templatePath]);
    }
    return new Promise((resolve, reject) => {
      fs.readFile(templatePath, 'utf-8', (err, file) => {
        if (err) {
          return reject(err);
        }
        const ret = file.replace(/\\"/g, '"');
        FILE_CACHE[templatePath] = ret;
        return resolve(ret);
      });
    });
  }
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
      const tmpTokens = Object.assign({}, this.options.tokens);
      // We are using tokens, which are reassignments of values to new names.
      for (let i = 0; i < Object.keys(tmpTokens).length; i += 1) {
        // We need to get the values and assign them to their new names.
        // These can retrieve nested values as well.
        tmpTokens[Object.keys(tmpTokens)[i]] = _.get(
          tmpValue,
          tmpTokens[Object.keys(tmpTokens)[i]]
        );
      }
      tokens = Object.assign({}, tokens, tmpTokens);
    }
    else {
      // we are not using tokens.
      tokens = Object.assign({}, tokens, tmpValue);
    }
    let template;
    let partials = {};
    let destinationTemplate;
    if (this.getTemplateObject()) {
      const objTemplate = this.getTemplateObject();
      destinationTemplate = _.get(objTemplate, 'destinationTemplate');

      if (_.get(this.options, 'template.targetPartial', false)) {
        destinationTemplate = _.get(objTemplate, this.options.template.targetPartial);
      }
      else if (_.get(this.options, 'template.filterPartials', false)) {
        // Render only a targeted element of the destination template object.
        partials = _.pick(objTemplate, this.options.template.filterPartials);
      }
      else {
        partials = _.omit(objTemplate, ['destinationTemplate']);
      }

      if (!destinationTemplate) {
        throw new Error('Using templated object with no destination template value.');
      }
      template = Promise.resolve(destinationTemplate);
    }
    else {
      const templatePath = path.resolve(
        this.getCallPath(),
        this.options.origin
      );
      template = this.constructor._getFile(templatePath);
    }

    return template
      .then((tmpTemplate) => {
        if (_.isEmpty(tokens) && !_.get(this.options, 'template.renderEmptyTokens', true)) {
          return super.transform({});
        }

        if (this.options.json) {
          if (mustache.render(tmpTemplate, tokens)) {
            return super.transform(JSON.parse(mustache.render(tmpTemplate, tokens, partials)));
          }
        }

        if (this.options.unescape) {
          return super.transform(mustache.render(
            tmpTemplate,
            tokens,
            partials
          ).replace(/\\"/g, '"'));
        }

        return super.transform(mustache.render(tmpTemplate, tokens, partials));
      });
  }
};
