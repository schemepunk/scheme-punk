'use strict';


const SchemePunk = require('./../lib/schemePunk'); // eslint-disable-line no-unused-vars
const validScheme = require('./helpers/schemePunkValidScheme');

module.exports = {
  // Test to see that a scheme punk item in the config with no plugins adds
  // no additional plugins.
  SchemePunkValidateValidScheme: (test) => {
    test.expect(1);
    test.deepEqual(
      SchemePunk.validateScheme(validScheme),
      true
    );
    test.done();
  },
  SchemePunkValidateInvalidScheme: (test) => {
    test.expect(1);
    test.deepEqual(
      SchemePunk.validateScheme({destination: 'nope'}),
      false
    );
    test.done();
  }
};
