module.exports = {
    entry: './resources/assets/js/deps.js',
    resolve: {
        modulesDirectories: ['node_modules'],
        root: ['C:/dev/do_stuff/node_modules'],
        alias: {},
        extensions: ['', '.jsx', '.js']
    },
    output: {
        path: './public/js',
        filename: 'bundle.js'
    },
    module: {
        noParse: [],
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }, // use ! to chain loaders
            { test: /\.png$/, loader: "url-loader?limit=100000&mimetype=image/png" },
            { test: /\.js$/, loader: "babel", query: {presets:['react']} },
            { test: /\.jsx$/, loader: "babel", query: {presets:['react']} }
        ]
    }
};