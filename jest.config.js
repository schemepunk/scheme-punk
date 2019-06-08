'use strict';

module.exports = {
  coverageDirectory: '__coverage__',
  coverageReporters: [
    'json',
    'json-summary',
    'lcov',
    'text',
    'text-summary'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: [
    '<rootDir>/lib/**',
    '!<rootDir>/lib/schemas/**',
    '!<rootDir>/src/**/__snapshots__/**',
    '!<rootDir>/__tests__/helpers/**/*',
    '!<rootDir>/__tests__/helpers/*',
    '!<rootDir>/lib/molotov.json'
  ],
  testMatch: [
    '<rootDir>/__tests__/**/*.js'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/__helpers__/',
    '<rootDir>/__tests__/.*/[__mocks__|files]/'
  ],
  testEnvironment: 'node'
};
