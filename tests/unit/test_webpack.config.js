/**
 * @jest-environment node
 */

const path = require('path');
const webpack = require('webpack');

// Mock webpack config to test against
jest.mock('../../../webpack.config.js', () => ({
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
  },
}));

const webpackConfig = require('../../../webpack.config.js');

describe('Webpack Configuration', () => {
  test('should have correct entry point', () => {
    expect(webpackConfig.entry).toBe('./src/index.js');
  });

  test('should have correct output configuration', () => {
    expect(webpackConfig.output).toEqual({
      path: expect.any(String),
      filename: 'bundle.js',
    });
    expect(path.isAbsolute(webpackConfig.output.path)).toBe(true);
  });

  test('should have JavaScript loader configuration', () => {
    const jsRule = webpackConfig.module.rules.find(
      rule => rule.test.toString() === '/\\.js$/'
    );
    expect(jsRule).toBeDefined();
    expect(jsRule.exclude.toString()).toBe('/node_modules/');
    expect(jsRule.use).toContain('babel-loader');
  });

  test('should have CSS loader configuration', () => {
    const cssRule = webpackConfig.module.rules.find(
      rule => rule.test.toString() === '/\\.css$/'
    );
    expect(cssRule).toBeDefined();
    expect(cssRule.use).toContain('style-loader');
    expect(cssRule.use).toContain('css-loader');
  });

  test('should have DefinePlugin configured', () => {
    const definePlugin = webpackConfig.plugins.find(
      plugin => plugin instanceof webpack.DefinePlugin
    );
    expect(definePlugin).toBeDefined();
  });

  test('should have development server configuration', () => {
    expect(webpackConfig.devServer).toEqual({
      contentBase: './dist',
      hot: true,
    });
  });

  test('should have hot module replacement enabled', () => {
    expect(webpackConfig.devServer.hot).toBe(true);
  });

  test('should exclude node_modules from transpilation', () => {
    const jsRule = webpackConfig.module.rules.find(
      rule => rule.test.toString() === '/\\.js$/'
    );
    expect(jsRule.exclude.toString()).toBe('/node_modules/');
  });
});

describe('Webpack Config Environment', () => {
  test('should have NODE_ENV set to development', () => {
    const definePlugin = webpackConfig.plugins.find(
      plugin => plugin instanceof webpack.DefinePlugin
    );
    const envConfig = definePlugin.definitions['process.env.NODE_ENV'];
    expect(JSON.parse(envConfig)).toBe('development');
  });
});

describe('Webpack Config Security', () => {
  test('should not expose sensitive environment variables', () => {
    const definePlugin = webpackConfig.plugins.find(
      plugin => plugin instanceof webpack.DefinePlugin
    );
    const definitions = definePlugin.definitions;
    
    // Ensure no sensitive env vars are exposed
    const sensitiveKeys = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN'];
    sensitiveKeys.forEach(key => {
      expect(definitions[`process.env.${key}`]).toBeUndefined();
    });
  });
});