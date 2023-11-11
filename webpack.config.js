const path = require('path'); // CommonJS sistema de módulos do node

module.exports = {
    mode: 'production',
    entry: './frontend/main.js',
    output: { 
        path: path.resolve(__dirname, 'public', 'assets', 'js'),
        filename: 'bundle.js'
    }, 
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    devtool: 'source-map'
};