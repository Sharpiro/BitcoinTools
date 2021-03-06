const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: "development",
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                loader: 'babel-loader',

                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};