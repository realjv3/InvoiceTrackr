require('es6-promise').polyfill();
var path = require('path');

module.exports = {
    entry: {
        landing: './resources/assets/js/pages/landing.jsx',
        trx: './resources/assets/js/pages/trx.jsx',
        invoices: './resources/assets/js/pages/invoices.jsx',
        reports: './resources/assets/js/pages/reports.jsx',
        profile: './resources/assets/js/pages/user_profile.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }, // use ! to chain loaders
            { test: /\.png$/, loader: "url-loader?limit=100000&mimetype=image/png" },
            {
                test: [/\.jsx$/],
                loader: "babel-loader",
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
                    plugins: ['transform-class-properties'] //fixes babel not compiling arrow functions and static properties
                }
            }
        ]
    },
    resolve: {
        modules: [
            './node_modules',
            './resources/assets/js',
            './resources/assets/css',
            './resources/assets/landing_animation',
        ]
    }
};
