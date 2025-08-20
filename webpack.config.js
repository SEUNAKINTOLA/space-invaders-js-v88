const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

/**
 * Webpack configuration for Space Invaders JS V88
 * Supports both development and production builds with appropriate optimizations
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // Base configuration shared between dev and prod
  const config = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      clean: true,
    },

    // Enable source maps for debugging
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    // Development server configuration
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      hot: true,
      compress: true,
      port: 9000,
      client: {
        overlay: true,
      },
    },

    // Module rules for different file types
    module: {
      rules: [
        // JavaScript files
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
              ],
            },
          },
        },
        // Asset handling
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[hash][ext]',
          },
        },
        // Audio files
        {
          test: /\.(wav|mp3|ogg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/audio/[name].[hash][ext]',
          },
        },
      ],
    },

    // Plugins configuration
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body',
      }),
      new ESLintPlugin({
        extensions: ['js'],
        exclude: ['node_modules'],
      }),
    ],

    // Optimization configuration
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
            },
          },
          extractComments: false,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          engine: {
            test: /[\\/]src[\\/]engine[\\/]/,
            name: 'engine',
            chunks: 'all',
          },
        },
      },
    },

    // Performance hints
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },

    // Resolution configuration
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@engine': path.resolve(__dirname, 'src/engine'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  };

  // Development-specific configurations
  if (!isProduction) {
    config.stats = {
      colors: true,
      modules: true,
      reasons: true,
      errorDetails: true,
    };
  }

  // Production-specific configurations
  if (isProduction) {
    config.output.publicPath = '/';
    config.optimization.moduleIds = 'deterministic';
    config.optimization.runtimeChunk = 'single';
  }

  return config;
};