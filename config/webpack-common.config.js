'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_PATH = path.join(__dirname, '../src');

const cssLoader = [
    'css-loader?' + ['localIdentName=[local]__[hash:base64:4]', 'modules', 'importLoaders=1', 'sourceMap'].join('&'),
    'postcss-loader'
].join('!');

module.exports = {
    entry: {
        main: './src/main.jsx',
        vendor: './src/vendor.js'
    },

    module: {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint',
                include: SRC_PATH
            }
        ],

        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                include: SRC_PATH
            },
            {
                // Transform our own .css files using PostCSS and CSS-modules
                test: /\.css$/,
                include: SRC_PATH,
                loader: ExtractTextPlugin.extract({
                    notExtractLoader: 'style-loader',
                    loader: cssLoader
                })
            },
            {
                // Do not transform vendor's CSS with CSS-modules
                test: /\.css$/,
                include: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    notExtractLoader: 'style-loader',
                    loader: 'css-loader'
                })
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'file',
                query: {
                    name: '[name].[hash].[ext]'
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'url',
                query: {
                    name: '[name].[hash].[ext]',
                    limit: 25000,
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },

    resolve: {
        modules: [SRC_PATH, 'node_modules'],
        extensions: ['', '.js', '.jsx', '.json']
    },

    // Process the CSS with PostCSS
    postcss: () => [
        require('precss')(),
        require('postcss-cssnext')({
            browsers: ['last 2 versions', 'ie > 10']
        }),
        require('postcss-reporter')({ // Posts messages from plugins to the terminal
            clearMessages: true
        })
    ],

    plugins: [
        new HtmlPlugin({
            title: 'MobX Contacts',
            template: './src/index.html',
            favicon: './src/assets/favicons/favicon.png',
            inject: true
        }),
        new CopyWebpackPlugin([
            { from: './src/assets/favicons/**/*', to: path.resolve(__dirname, '../dist'), flatten: true }
        ]
        ),
        new ExtractTextPlugin({
            filename: 'main.[chunkhash].css',
            allChunks: true
        })
    ]
};
