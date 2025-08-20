const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/**
 * Webpack configuration for Space Invaders JS V88
 * Handles both development and production builds
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // Entry point of the application
    entry: './src/index.js',

    // Output configuration
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      clean: true,
    },

    // Development server configuration
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      hot: true,
      compress: true,
      port: 9000,
      client: {
        overlay: true,
      },
    },

    // Source maps configuration
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    // Module rules for different file types
    module: {
      rules: [
        // JavaScript processing
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        // CSS processing
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        // Image assets
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[hash][ext]',
          },
        },
        // Audio assets
        {
          test: /\.(wav|mp3|ogg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/sounds/[name].[hash][ext]',
          },
        },
      ],
    },

    // Plugins configuration
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body',
        minify: isProduction,
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
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
        },
      },
    },

    // Resolution configuration
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@controllers': path.resolve(__dirname, 'src/controllers'),
        '@engine': path.resolve(__dirname, 'src/engine'),
        '@entities': path.resolve(__dirname, 'src/entities'),
        '@patterns': path.resolve(__dirname, 'src/patterns'),
        '@systems': path.resolve(__dirname, 'src/systems'),
        '@ui': path.resolve(__dirname, 'src/ui'),
      },
    },

    // Performance hints
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };
};