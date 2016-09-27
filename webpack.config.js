module.exports = {
    entry: {
        landing: './resources/assets/js/root_cmpnts/landing.jsx',
        content: './resources/assets/js/root_cmpnts/content.jsx',
        profile: './resources/assets/js/root_cmpnts/user_profile.jsx',
    },
    output: {
        path: './public/js',
        filename: '[name].js'
    },
    module: {
        noParse: [],
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }, // use ! to chain loaders
            { test: /\.png$/, loader: "url-loader?limit=100000&mimetype=image/png" },
            {
                test: /\.jsx$/,
                loader: "babel",
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
                    plugins: ['transform-class-properties'] //fixes babel not compiling arrow functions and static properties
                }
            }
        ]
    },
    resolve: {
        modulesDirectories: [
            './node_modules',
            './resources/assets/js',
            './resources/assets/css',
            './resources/assets/landing_animation',
        ]
    }
};