const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/**
 * Webpack configuration factory
 * @param {Object} env - Environment variables
 * @param {Object} argv - CLI arguments
 * @returns {Object} Webpack configuration object
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // Base configuration shared between dev and prod
  const config = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      publicPath: '/'
    },

    // Enable source maps for debugging
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    // Development server configuration
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      hot: true,
      port: 3000,
      compress: true,
      historyApiFallback: true
    },

    // Module rules for different file types
    module: {
      rules: [
        // JavaScript/JSX files
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        // CSS files
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        // Asset files (images, fonts, etc.)
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[hash][ext][query]'
          }
        }
      ]
    },

    // Plugins configuration
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: './src/assets/favicon.ico',
        inject: true,
        minify: isProduction
      })
    ],

    // Optimization configuration
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        name: false
      }
    },

    // Resolution configuration
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'src/core'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@input': path.resolve(__dirname, 'src/input'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@styles': path.resolve(__dirname, 'src/styles')
      }
    }
  };

  // Production-specific configuration
  if (isProduction) {
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
      })
    );

    // Additional production optimizations
    config.optimization = {
      ...config.optimization,
      runtimeChunk: 'single',
      moduleIds: 'deterministic'
    };
  }

  return config;
};