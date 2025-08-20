/**
 * Jest configuration for Space Invaders JS V88
 * Configures test environment, coverage reporting, and module handling
 */
module.exports = {
  // Test environment
  testEnvironment: 'jsdom', // Using jsdom for DOM manipulation tests
  
  // Test file patterns
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/dist/'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Module file extensions
  moduleFileExtensions: ['js'],

  // Module name mapper for assets/styles
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/mocks/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/tests/mocks/styleMock.js'
  },

  // Setup files
  setupFiles: ['<rootDir>/tests/setup.js'],

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],

  // Transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    'performance/'
  ],

  // Global setup
  globalSetup: '<rootDir>/tests/globalSetup.js',
  
  // Global teardown  
  globalTeardown: '<rootDir>/tests/globalTeardown.js',

  // Environment variables
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};