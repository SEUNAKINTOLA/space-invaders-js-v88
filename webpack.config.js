const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Webpack configuration for Space Invaders JS V88
 * Optimized for game development with canvas rendering
 */
module.exports = {
  // Development mode by default, use --mode production for production builds
  mode: process.env.NODE_ENV || 'development',
  
  // Main entry point
  entry: {
    game: './src/engine/GameEngine.js',
  },

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true // Clean dist folder before each build
  },

  // Development server configuration
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    client: {
      overlay: true, // Show errors as overlay
    }
  },

  // Source maps for debugging
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',

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
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      // CSS processing
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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

  // Optimization configuration
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production',
            dead_code: true
          }
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
      name: 'vendors'
    }
  },

  // Plugins configuration
  plugins: [
    // Generate HTML file
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      minify: process.env.NODE_ENV === 'production'
    }),
    // Copy static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
          globOptions: {
            ignore: ['**/*.DS_Store'] // Ignore system files
          }
        }
      ]
    })
  ],

  // Resolve configuration
  resolve: {
    extensions: ['.js'],
    alias: {
      '@engine': path.resolve(__dirname, 'src/engine/'),
      '@entities': path.resolve(__dirname, 'src/entities/'),
      '@systems': path.resolve(__dirname, 'src/systems/'),
      '@patterns': path.resolve(__dirname, 'src/patterns/'),
      '@config': path.resolve(__dirname, 'src/config/')
    }
  },

  // Performance hints
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};