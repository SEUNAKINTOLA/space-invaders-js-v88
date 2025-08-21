const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/**
 * Webpack configuration factory for Space Invaders JS V88
 * Optimized for game development with canvas rendering
 * @param {Object} env - Environment variables
 * @param {Object} argv - CLI arguments
 * @returns {Object} Webpack configuration object
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // Base configuration shared between dev and prod
  const config = {
    // Main entry point
    entry: './src/index.js',
    
    // Output configuration
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      publicPath: '/',
      clean: true // Clean dist folder before each build
    },

    // Enable source maps for debugging
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    // Development server configuration
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      hot: true,
      port: 9000,
      compress: true,
      historyApiFallback: true,
      client: {
        overlay: true // Show errors as overlay
      }
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
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
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
        // Image assets
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[hash][ext][query]'
          }
        },
        // Audio assets
        {
          test: /\.(wav|mp3|ogg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/audio/[hash][ext][query]'
          }
        }
      ]
    },

    // Plugins configuration
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body',
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
              drop_console: isProduction,
              dead_code: true
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        name: isProduction ? false : 'vendors'
      }
    },

    // Resolution configuration
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@engine': path.resolve(__dirname, 'src/engine/'),
        '@entities': path.resolve(__dirname, 'src/entities/'),
        '@systems': path.resolve(__dirname, 'src/systems/'),
        '@patterns': path.resolve(__dirname, 'src/patterns/'),
        '@config': path.resolve(__dirname, 'src/config/'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@input': path.resolve(__dirname, 'src/input'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@styles': path.resolve(__dirname, 'src/styles')
      }
    },

    // Performance hints
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
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