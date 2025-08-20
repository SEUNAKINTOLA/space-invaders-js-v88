/**
 * @file tests/unit/test_.eslintrc.js
 * Unit tests for ESLint configuration validation
 */

describe('ESLint Configuration', () => {
  let eslintConfig;

  beforeEach(() => {
    // Reset the config before each test
    jest.resetModules();
    eslintConfig = require('../../.eslintrc.js');
  });

  describe('Basic Configuration', () => {
    test('should export a valid ESLint configuration object', () => {
      expect(eslintConfig).toBeDefined();
      expect(typeof eslintConfig).toBe('object');
    });

    test('should have required root properties', () => {
      expect(eslintConfig).toHaveProperty('env');
      expect(eslintConfig).toHaveProperty('extends');
      expect(eslintConfig).toHaveProperty('parserOptions');
      expect(eslintConfig).toHaveProperty('rules');
    });
  });

  describe('Environment Configuration', () => {
    test('should have correct environment settings', () => {
      expect(eslintConfig.env).toEqual(
        expect.objectContaining({
          browser: true,
          es2021: true,
          jest: true,
        })
      );
    });
  });

  describe('Parser Options', () => {
    test('should have correct parser options', () => {
      expect(eslintConfig.parserOptions).toEqual(
        expect.objectContaining({
          ecmaVersion: 'latest',
          sourceType: 'module',
        })
      );
    });
  });

  describe('Rules Configuration', () => {
    test('should have essential rules defined', () => {
      const rules = eslintConfig.rules;
      expect(rules).toBeDefined();
      expect(typeof rules).toBe('object');
    });

    test('should have strict error handling rules', () => {
      const rules = eslintConfig.rules;
      expect(rules['no-unused-vars']).toBeDefined();
      expect(rules['no-undef']).toBeDefined();
    });

    test('should enforce consistent spacing rules', () => {
      const rules = eslintConfig.rules;
      expect(rules['indent']).toBeDefined();
      expect(rules['semi']).toBeDefined();
    });
  });

  describe('Extends Configuration', () => {
    test('should extend from recommended configurations', () => {
      expect(Array.isArray(eslintConfig.extends)).toBe(true);
      expect(eslintConfig.extends).toContain('eslint:recommended');
    });
  });

  describe('Integration Tests', () => {
    test('should have compatible rules with Prettier', () => {
      const rules = eslintConfig.rules;
      // Ensure no conflicting rules with Prettier
      expect(rules['prettier/prettier']).toBeFalsy();
    });

    test('should have proper module resolution settings', () => {
      if (eslintConfig.settings) {
        expect(typeof eslintConfig.settings).toBe('object');
      }
    });
  });

  describe('Error Prevention', () => {
    test('should prevent common JavaScript errors', () => {
      const rules = eslintConfig.rules;
      expect(rules['no-console']).toBeDefined();
      expect(rules['no-debugger']).toBeDefined();
    });

    test('should enforce strict equality comparisons', () => {
      const rules = eslintConfig.rules;
      expect(rules['eqeqeq']).toBeDefined();
    });
  });

  describe('Project Specific Rules', () => {
    test('should have rules appropriate for a game development project', () => {
      const rules = eslintConfig.rules;
      
      // Game development often needs performance optimizations
      expect(rules['no-unused-expressions']).toBeDefined();
      
      // Ensure proper handling of async operations
      expect(rules['no-async-promise-executor']).toBeDefined();
    });
  });
});