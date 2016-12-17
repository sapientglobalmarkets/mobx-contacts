'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack-common.config');

module.exports = merge(webpackCommon, {
    externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    },

    devtool: 'inline-source-map',

    plugins: [
        new webpack.DefinePlugin({
            '__DEV__': false
        }),
    ]
});
