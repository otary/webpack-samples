const baseConfig = require('./webpack.base.config');

const merge = require('webpack-merge');

const pagePath = './src/pages';

const devServerConfig = {

    devServer: {

        // 指定根目录
        contentBase: pagePath,

        // 指定端口
        port: 9999,

        // 热替换
        hot: true,
        inline: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        watchContentBase: true,

        // 启用gzip压缩
        compress: true,

        // 定义头部信息
        headers: {"X-Custom-Header": "yes"},

        // 重定向
        /*proxy: {
            "/api": {
                target: "http://localhost:3000",
                pathRewrite: {"^/api": ""}
            }
        }*/


    }


}


module.exports = merge(baseConfig, devServerConfig);