const baseConfig = require('./webpack.base.config');

const merge = require('webpack-merge');

const pagePath = './src/pages';

console.log(pagePath);

const devServerConfig = {

    devServer: {

        // 指定根目录
        contentBase: pagePath,

        // 指定端口
        port: 9999,

        // 启用gzip压缩
        compress: true


    }


}


module.exports = merge(baseConfig, devServerConfig);