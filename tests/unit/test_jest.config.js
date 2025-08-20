/**
 * @file tests/unit/test_jest.config.js
 * @description Unit tests for Jest configuration settings
 */

// Import the actual jest config
const jestConfig = require('../../jest.config.js');

describe('Jest Configuration', () => {
  test('should have correct basic configuration properties', () => {
    expect(jestConfig).toBeDefined();
    expect(typeof jestConfig).toBe('object');
  });

  test('should have correct test environment', () => {
    expect(jestConfig.testEnvironment).toBe('jsdom');
  });

  test('should have proper module file extensions', () => {
    expect(jestConfig.moduleFileExtensions).toEqual(
      expect.arrayContaining(['js', 'jsx', 'json'])
    );
  });

  test('should have correct test match patterns', () => {
    expect(jestConfig.testMatch).toEqual(
      expect.arrayContaining([
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js'
      ])
    );
  });

  test('should have proper coverage settings', () => {
    expect(jestConfig.collectCoverage).toBe(true);
    expect(jestConfig.coverageDirectory).toBe('coverage');
    expect(jestConfig.collectCoverageFrom).toEqual(
      expect.arrayContaining([
        'src/**/*.js',
        '!src/index.js',
        '!**/node_modules/**'
      ])
    );
  });

  test('should have correct transform settings', () => {
    expect(jestConfig.transform).toBeDefined();
    expect(typeof jestConfig.transform).toBe('object');
  });

  test('should have proper module name mapper for assets', () => {
    expect(jestConfig.moduleNameMapper).toBeDefined();
    expect(typeof jestConfig.moduleNameMapper).toBe('object');
    
    // Check for common asset mappings
    const moduleMapper = jestConfig.moduleNameMapper;
    expect(moduleMapper['\\.(css|less|scss)$']).toBeDefined();
    expect(moduleMapper['\\.(jpg|jpeg|png|gif|svg)$']).toBeDefined();
  });

  test('should have appropriate setup files', () => {
    expect(jestConfig.setupFiles).toBeDefined();
    expect(Array.isArray(jestConfig.setupFiles)).toBe(true);
  });

  test('should have proper test timeout', () => {
    expect(jestConfig.testTimeout).toBeGreaterThan(0);
  });

  test('should have verbose output enabled', () => {
    expect(jestConfig.verbose).toBe(true);
  });

  test('should have proper error handling settings', () => {
    expect(jestConfig.bail).toBeDefined();
    expect(typeof jestConfig.bail).toBe('number');
  });

  test('should have proper reporting settings', () => {
    expect(jestConfig.reporters).toBeDefined();
    expect(Array.isArray(jestConfig.reporters)).toBe(true);
  });
});

describe('Jest Configuration Security', () => {
  test('should not expose sensitive paths in configuration', () => {
    const configString = JSON.stringify(jestConfig);
    expect(configString).not.toMatch(/password/i);
    expect(configString).not.toMatch(/secret/i);
    expect(configString).not.toMatch(/token/i);
  });

  test('should have safe module resolution settings', () => {
    expect(jestConfig.moduleDirectories).toEqual(
      expect.arrayContaining(['node_modules'])
    );
  });
});

describe('Jest Performance Settings', () => {
  test('should have reasonable maxWorkers setting', () => {
    if (jestConfig.maxWorkers) {
      expect(typeof jestConfig.maxWorkers).toBe('string');
      expect(jestConfig.maxWorkers).toMatch(/^[0-9]+%$/);
    }
  });

  test('should have caching enabled', () => {
    expect(jestConfig.cache).toBe(true);
  });
});