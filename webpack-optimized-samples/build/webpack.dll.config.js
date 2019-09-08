/**
 * DLLPlugin示例
 *
 * @author chenzw
 */

const path = require('path');
const webpack = require('webpack');
const DllPlugin = webpack.DllPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const dllLibraryName = '_dll_[name]';
const distPath = path.resolve(process.cwd(), 'dist');
const distDllPath = path.join(distPath, 'dll');


module.exports = {
    entry: {
        vendor: ['jquery', 'bootstrap', 'bootstrap/dist/css/bootstrap.css']
    },
    output: {
        filename: '[name].dll.js',
        path: distDllPath,
        library: dllLibraryName
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loaders: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader'
                    }],
                    fallback: 'style-loader'
                })
            }, {
                test: /\.scss/,
                loaders: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }, {
                test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
                use: ['file-loader']
            }, {
                test: /\eot(\?v=\d+\\d+\\d+)?$/,
                use: ['file-loader']
            }, {
                test: /\.(woff|woff2)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        prefix: 'font/',
                        limit: 5000
                    }
                }]
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/octet-stream'
                    }
                }]
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'image/svg+xml'
                    }
                }]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].dll.css'
        }),
        new DllPlugin({
            name: dllLibraryName,
            path: path.join(distDllPath, '[name].manifest.json')
        })
    ]
}