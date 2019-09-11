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
const rootPath = process.cwd();
const distPath = path.resolve(rootPath, 'dist');
const distDllPath = path.join(distPath, 'dll');


module.exports = {
    entry: {
        vendor_dll: ['jquery', 'bootstrap', 'bootstrap/dist/css/bootstrap.css',
            'axios'
            /*, 'font-awesome/css/font-awesome.css'*/
        ]
    },
    output: {
        filename: '[name].dll.js',
        path: distDllPath,
        library: dllLibraryName
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                loaders: ExtractTextPlugin.extract({
                    use: ['css-loader', 'postcss-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }, {
                test: /\.(gif|png|jpe?g|pdf)$/,
                use: ['file-loader']
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[hash:8].[ext]',
                        limit: 10000
                    }
                }]
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimeType: 'image/svg+xml'
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
 	    context: __dirname,
            name: dllLibraryName,
            path: path.join(distDllPath, '[name].manifest.json')
        })
    ]
}
