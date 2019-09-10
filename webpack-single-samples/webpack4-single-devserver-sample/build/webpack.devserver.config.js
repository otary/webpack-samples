/**
 * webpack-dev-server参数配置
 *
 * @author chenzw
 */
const path = require('path');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');

const rootPath = path.resolve(process.cwd());
const srcPath = path.resolve(rootPath, 'src');
const distPath = path.resolve(rootPath, 'dist');


const devServerConfig = {

    devServer: {

        // 指定根目录
        contentBase: distPath,

        // 指定端口
        port: 9999,

        // 热替换
        inline: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        watchContentBase: true,

        // 启用gzip压缩
        compress: true,

        // 定义头部信息
        headers: {"Access-Control-Allow-Origin": "*"},

        // 编译完成后打开浏览器
        // open: true,

        // 显示编译进度
        progress: true

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
