module.exports = {
    entry: {
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
            { test: /\.jsx|.js$/, loader: "babel-loader", query: {presets:['react', 'es2015']} }
        ]
    },
    resolve: {
        modulesDirectories: [
            './node_modules',
            './resources/assets/js',
            './resources/assets/css',
        ]
    }
};