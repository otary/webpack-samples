/**
 * DLLPlugin示例
 *
 * @author chenzw
 */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DllPlugin = webpack.DllPlugin;

const distPath = path.resolve(process.cwd(), 'dist');
const distDllPath = path.join(distPath, 'dll');

module.exports = {
    entry: {
        vendor: ['jquery', 'bootstrap', 'layui-layer']
    },
    output: {
        filename: '[name].dll.js',
        path: distDllPath,
        library: '_dll_[name]'
    },
    plugins: [
        new DllPlugin({
            name: '_dll_[name]',
            path: path.join(distDllPath, '[name].manifest.json')
        })
    ]
}