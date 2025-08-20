/**
 * Jest Configuration File
 * Project: Space Invaders JS V88
 * 
 * This configuration sets up Jest testing framework with:
 * - Custom test environment setup
 * - Coverage reporting
 * - Module aliases
 * - Test matching patterns
 * - Performance testing timeouts
 */

module.exports = {
  // Basic Configuration
  verbose: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test Pattern Matching
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/integration/**/*.test.js',
    '<rootDir>/tests/performance/**/*.test.js'
  ],

  // Coverage Configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/config/*.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Module Resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@engine/(.*)$': '<rootDir>/src/engine/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  },

  // Performance Testing Configuration
  testTimeout: 10000, // 10 seconds for performance tests
  maxConcurrency: 5,  // Limit concurrent test execution

  // Transform Configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Module File Extensions
  moduleFileExtensions: ['js', 'json'],

  // Test Environment Options
  testEnvironmentOptions: {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable'
  },

  // Reporter Configuration
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}'
      }
    ]
  ],

  // Global Setup/Teardown
  globalSetup: undefined,
  globalTeardown: undefined,

  // Watch Plugin Configuration
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],

  // Error Handling
  bail: 0,  // Don't fail fast
  notify: true,  // Desktop notifications for test results

  // Cache Configuration
  cacheDirectory: '.jest-cache',
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true
};