/**
 * Jest Configuration for Space Invaders JS V88
 * Configures Jest testing framework with appropriate settings for the project structure
 */
module.exports = {
  // The root directory where Jest should scan for files
  rootDir: '.',

  // The test environment to use
  testEnvironment: 'jsdom',

  // File patterns to look for test files
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],

  // Directories to ignore during test discovery
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ],

  // Configure code coverage collection
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/assets/**',
    '!src/styles/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Module file extensions to handle
  moduleFileExtensions: ['js', 'json'],

  // Module name mapper for handling assets and styles
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/mocks/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/tests/mocks/styleMock.js'
  },

  // Setup files to run before tests
  setupFiles: [
    '<rootDir>/tests/setup/setupTests.js'
  ],

  // Configure test timeouts
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Watch plugins configuration
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],

  // Transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Global variables available in all test files
  globals: {
    DEVELOPMENT: false,
    PRODUCTION: false,
    TEST: true
  },

  // Reporter configuration
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

  // Error handling configuration
  bail: 1,
  errorOnDeprecated: true
};