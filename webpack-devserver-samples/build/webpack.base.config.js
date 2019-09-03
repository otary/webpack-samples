const path = require('path');
const webpack = require('webpack');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const {AutoWebPlugin} = require('web-webpack-plugin');

const pagePath = './src/pages';

const autoWebPlugin = new AutoWebPlugin(pagePath, {
    template: (pageName) => {
        return path.resolve(pagePath, pageName, 'template.html');
    },
    // 生成的文件名
    filename: (pageName) => {
        return path.join(pageName, 'index');
    },
    commonsChunk: {
        name: 'common',
        filename: '[name].js'
    },
    requires: ['common']
});

module.exports = {
    entry: autoWebPlugin.entry({}),
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: '[name]/[name].js'
    },
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [{
            test: require.resolve('jquery'),  // require.resolve 用来获取模块的绝对路径
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            }, {
                loader: 'expose-loader',
                options: '$'
            }]
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        }, {
            test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
            use: ['file-loader']
        }, {
            test: /\.vue$/,
            use: ['vue-loader'],
        }]
    },
    plugins: [
        autoWebPlugin
    ],
    devServer: {}
}