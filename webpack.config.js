module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:49666',
        './src/app.ts'
    ],
    output: {
        filename: 'build/bundle.js'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}