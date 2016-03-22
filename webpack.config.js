var webpack = require('webpack');
var path = require('path');

var app_dir = path.resolve(__dirname, 'reacts');
var build_dir = path.resolve(__dirname, 'public/javascripts');

var config = {
    entry: {
        landing: app_dir + '/landing.jsx',
        header: app_dir + '/header.jsx',
        home: app_dir + '/home.jsx'
    },
    output: {
        path: build_dir,
        filename: '[name].js'
    },
    module: {
    loaders: [{
        test: /\.jsx?/,
        include: app_dir,
        loader: 'babel'
    }]
    }
}

module.exports = config;