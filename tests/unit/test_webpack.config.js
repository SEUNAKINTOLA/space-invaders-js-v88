/**
 * @file tests/unit/test_webpack.config.js
 * @description Unit tests for webpack configuration
 */

// Import webpack configuration
const webpackConfig = require('../../webpack.config.js');
const path = require('path');

describe('Webpack Configuration', () => {
    test('should have correct mode setting', () => {
        expect(webpackConfig.mode).toBeDefined();
        expect(['development', 'production']).toContain(webpackConfig.mode);
    });

    test('should have entry point configured', () => {
        expect(webpackConfig.entry).toBeDefined();
        expect(webpackConfig.entry).toBe('./src/index.js');
    });

    test('should have correct output configuration', () => {
        expect(webpackConfig.output).toBeDefined();
        expect(webpackConfig.output.filename).toBe('bundle.js');
        expect(webpackConfig.output.path).toBe(path.resolve(__dirname, '../../dist'));
    });

    test('should have proper module rules', () => {
        expect(webpackConfig.module).toBeDefined();
        expect(Array.isArray(webpackConfig.module.rules)).toBe(true);

        // Test CSS rule configuration
        const cssRule = webpackConfig.module.rules.find(rule => 
            rule.test.toString().includes('.css'));
        expect(cssRule).toBeDefined();
        expect(cssRule.use).toContain('style-loader');
        expect(cssRule.use).toContain('css-loader');

        // Test image rule configuration
        const imageRule = webpackConfig.module.rules.find(rule => 
            rule.test.toString().match(/\.(png|svg|jpg|jpeg|gif)$/i));
        expect(imageRule).toBeDefined();
        expect(imageRule.type).toBe('asset/resource');
    });

    test('should have proper devServer configuration', () => {
        expect(webpackConfig.devServer).toBeDefined();
        expect(webpackConfig.devServer.static).toBeDefined();
        expect(webpackConfig.devServer.static.directory).toBe(path.join(__dirname, '../../dist'));
        expect(webpackConfig.devServer.port).toBeDefined();
        expect(typeof webpackConfig.devServer.port).toBe('number');
    });

    test('should have proper resolve configuration', () => {
        expect(webpackConfig.resolve).toBeDefined();
        expect(Array.isArray(webpackConfig.resolve.extensions)).toBe(true);
        expect(webpackConfig.resolve.extensions).toContain('.js');
    });

    test('should have source map configuration for development', () => {
        if (webpackConfig.mode === 'development') {
            expect(webpackConfig.devtool).toBeDefined();
            expect(webpackConfig.devtool).toBe('source-map');
        }
    });

    test('should have proper optimization settings', () => {
        expect(webpackConfig.optimization).toBeDefined();
        if (webpackConfig.mode === 'production') {
            expect(webpackConfig.optimization.minimize).toBe(true);
            expect(webpackConfig.optimization.minimizer).toBeDefined();
        }
    });

    test('should handle audio file imports', () => {
        const audioRule = webpackConfig.module.rules.find(rule => 
            rule.test.toString().match(/\.(mp3|wav|ogg)$/i));
        expect(audioRule).toBeDefined();
        expect(audioRule.type).toBe('asset/resource');
    });

    test('should have proper plugins configuration', () => {
        expect(Array.isArray(webpackConfig.plugins)).toBe(true);
        
        // Test for HtmlWebpackPlugin
        const htmlPlugin = webpackConfig.plugins.find(plugin => 
            plugin.constructor.name === 'HtmlWebpackPlugin');
        expect(htmlPlugin).toBeDefined();
        expect(htmlPlugin.options.template).toBe('./src/index.html');
    });
});

describe('Webpack Environment Specific Configuration', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
    });

    test('should have proper development settings', () => {
        process.env.NODE_ENV = 'development';
        const devConfig = require('../../webpack.config.js');
        expect(devConfig.mode).toBe('development');
        expect(devConfig.devtool).toBe('source-map');
    });

    test('should have proper production settings', () => {
        process.env.NODE_ENV = 'production';
        const prodConfig = require('../../webpack.config.js');
        expect(prodConfig.mode).toBe('production');
        expect(prodConfig.optimization.minimize).toBe(true);
    });
});