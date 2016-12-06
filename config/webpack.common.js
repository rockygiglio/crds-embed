var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var Dotenv = require('dotenv-webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var StringReplacePlugin = require("string-replace-webpack-plugin");

module.exports = {
  entry: {
    'polyfills': ['./src/polyfills.ts'],
    'vendor': ['./src/vendor.ts'],
    'app': ['./src/main.ts'],
    'apache_site': ['./apache_site.conf']
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file"
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['raw-loader', 'sass-loader']
      },
      {
        test: /apache_site\.conf$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /\${(.*)}/g,
              replacement: function (match, p1, offset, string) {
                console.log(eval('process.env.' + p1).toString());
                return eval('process.env.' + p1).toString();
              }
            }
          ]
        })
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills', 'apache_site']
    }),

    new Dotenv({
      systemvars: true
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets',
    }], { ignore: ['*.scss', 'mock-data/*'] }),

    new CopyWebpackPlugin([{
      from: './apache_site.conf',
      to: 'apache_site.conf',
    }]),

    new StringReplacePlugin()
  ]
};