'use strict';

module.exports = {
  coverageDirectory: '__coverage__',
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
    '!<rootDir>/src/**/__snapshots__/**',
    '!<rootDir>/__tests__/helpers/**/*',
    '!<rootDir>/__tests__/helpers/*',
  ],
  testPathIgnorePatterns: ['<rootDir>/__tests__/helpers/'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  reporters: ['default'],
};
