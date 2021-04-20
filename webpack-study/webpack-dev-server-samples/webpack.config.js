const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        pageA: "./src/pageA/index.js",
    },
    output: {
        path: path.resolve('./src/pageA'),
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    module: {
        rules: [
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            }
        ]
    }
}
