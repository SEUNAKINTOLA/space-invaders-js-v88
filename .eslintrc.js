module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  plugins: ['jest', 'prettier'],
  rules: {
    // Error Prevention
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-var': 'error',
    
    // Modern JavaScript
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    
    // Game Engine Specific
    'no-restricted-globals': ['error', 'event', 'name', 'length'],
    'max-classes-per-file': ['error', 1],
    
    // Code Style
    'indent': ['error', 2],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    
    // Best Practices
    'curly': ['error', 'all'],
    'eqeqeq': ['error', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-return-await': 'error',
    
    // Documentation
    'valid-jsdoc': ['warn', {
      requireReturn: false,
      requireParamType: true,
      requireReturnType: true,
      prefer: {
        returns: 'return',
      },
    }],
    
    // Game Performance
    'no-extend-native': 'error',
    'no-loop-func': 'error',
    
    // Testing
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
  settings: {
    jest: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['tests/**/*.js', '**/*.test.js'],
      env: {
        jest: true,
      },
      rules: {
        'max-len': 'off',
        'no-magic-numbers': 'off',
      },
    },
    {
      files: ['src/engine/**/*.js'],
      rules: {
        'complexity': ['error', 15],
        'max-depth': ['error', 4],
        'max-params': ['error', 4],
      },
    },
  ],
};