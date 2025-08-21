/**
 * Jest Configuration for Space Invaders JS V88
 * Configures test environment, coverage reporting, and module resolution
 */
module.exports = {
  // Test environment setup
  testEnvironment: 'jsdom', // Using jsdom for browser-like environment
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test file patterns
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/integration/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    'performance/'
  ],

  // Module resolution and transformations
  moduleNameMapper: {
    // Handle CSS imports in tests
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.js',
    // Handle static asset imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/mocks/fileMock.js',
    // Path aliases for cleaner imports
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
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

  // Performance and optimization
  maxWorkers: '50%', // Limit parallel test execution
  verbose: true,
  bail: false, // Don't stop on first failure

  // Module file extensions
  moduleFileExtensions: ['js', 'json'],

  // Reporter configuration
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/junit',
        outputName: 'js-test-results.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}'
      }
    ]
  ],

  // Global test timeout
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,

  // Error handling
  errorOnDeprecated: true,

  // Custom resolver for module imports
  moduleDirectories: ['node_modules', 'src'],

  // Transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],

  // Global setup/teardown hooks
  globalSetup: '<rootDir>/tests/globalSetup.js',
  globalTeardown: '<rootDir>/tests/globalTeardown.js',

  // Environment variables
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};