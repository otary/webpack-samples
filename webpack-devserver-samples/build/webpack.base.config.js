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
    // 生成pagemap.json
    outputPagemap: true,
    hash: true,

    // 提取公共代码
    commonsChunk: {
        name: 'common',
        filename: '/assets/js/[name]-[hash].js'
    },

    // 引入其它chunk
    // requires: ['base']
});

module.exports = {
    entry: autoWebPlugin.entry({}),
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: '[name]/[name].js',

        // 指定静态资源路径
        // publicPath: 'https://cdn.cn/',
    },

    // 将外部变量或者模块加载进来
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