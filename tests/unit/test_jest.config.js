/**
 * Unit tests for jest.config.js configuration
 * Tests validate core Jest settings and project-specific configuration
 */

// Import Jest configuration
const jestConfig = require('../../jest.config.js');

describe('Jest Configuration', () => {
  test('should have correct test environment', () => {
    expect(jestConfig.testEnvironment).toBe('jsdom');
  });

  test('should have proper module file extensions', () => {
    expect(jestConfig.moduleFileExtensions).toEqual([
      'js',
      'jsx',
      'json'
    ]);
  });

  test('should configure proper test match patterns', () => {
    expect(jestConfig.testMatch).toContain('**/*.test.js');
    expect(jestConfig.testMatch).not.toContain('**/node_modules/**');
  });

  test('should have coverage collection configured', () => {
    expect(jestConfig.collectCoverage).toBe(true);
    expect(jestConfig.coverageDirectory).toBe('coverage');
  });

  test('should have proper coverage reporters', () => {
    expect(jestConfig.coverageReporters).toContain('text');
    expect(jestConfig.coverageReporters).toContain('lcov');
  });

  test('should configure proper module name mapper for assets', () => {
    const moduleNameMapper = jestConfig.moduleNameMapper;
    expect(moduleNameMapper).toBeDefined();
    expect(moduleNameMapper['\\.(jpg|jpeg|png|gif|svg)$']).toBe('<rootDir>/tests/mocks/fileMock.js');
    expect(moduleNameMapper['\\.(css|less|scss)$']).toBe('<rootDir>/tests/mocks/styleMock.js');
  });

  test('should have proper test timeout', () => {
    expect(jestConfig.testTimeout).toBe(10000);
  });

  test('should configure proper coverage thresholds', () => {
    const coverageThreshold = jestConfig.coverageThreshold;
    expect(coverageThreshold).toBeDefined();
    expect(coverageThreshold.global).toEqual({
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    });
  });

  test('should have proper transform configuration', () => {
    const transform = jestConfig.transform;
    expect(transform).toBeDefined();
    expect(transform['^.+\\.js$']).toBe('babel-jest');
  });

  test('should have proper setup files', () => {
    expect(jestConfig.setupFilesAfterEnv).toContain('<rootDir>/tests/setup.js');
  });

  test('should exclude node_modules from transformation', () => {
    expect(jestConfig.transformIgnorePatterns).toContain('/node_modules/');
  });

  test('should have proper test environment options', () => {
    const testEnvironmentOptions = jestConfig.testEnvironmentOptions;
    expect(testEnvironmentOptions).toBeDefined();
    expect(testEnvironmentOptions.url).toBe('http://localhost');
  });
});

describe('Jest Configuration Edge Cases', () => {
  test('should handle undefined optional properties gracefully', () => {
    // These properties are optional but should not break tests if undefined
    const optionalProps = [
      'bail',
      'verbose',
      'notify',
      'watchPlugins'
    ];

    optionalProps.forEach(prop => {
      expect(() => jestConfig[prop]).not.toThrow();
    });
  });

  test('should have valid regex patterns in moduleNameMapper', () => {
    const moduleNameMapper = jestConfig.moduleNameMapper;
    Object.keys(moduleNameMapper).forEach(pattern => {
      expect(() => new RegExp(pattern)).not.toThrow();
    });
  });

  test('should have valid coverage exclude patterns', () => {
    const coveragePathIgnorePatterns = jestConfig.coveragePathIgnorePatterns;
    expect(Array.isArray(coveragePathIgnorePatterns)).toBe(true);
    coveragePathIgnorePatterns.forEach(pattern => {
      expect(typeof pattern).toBe('string');
      expect(pattern.length).toBeGreaterThan(0);
    });
  });
});