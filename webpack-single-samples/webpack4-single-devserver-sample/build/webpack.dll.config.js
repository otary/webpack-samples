/**
 * DLLPlugin配置
 *
 * @author chenzw
 */

const path = require('path');
const webpack = require('webpack');
const DllPlugin = webpack.DllPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dllLibraryName = '_dll_[name]';
const distPath = path.resolve(process.cwd(), 'dist');
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
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // hmr: process.env.NODE_ENV === 'development',
                    },
                }, 'css-loader', 'postcss-loader', 'sass-loader']
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
                        name: 'assets/fonts/[name].[hash:8].[ext]',
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
        // 提取CSS文件
        new MiniCssExtractPlugin({
            filename: `[name].dll.css`,
            ignoreOrder: false
        }),
        new DllPlugin({
            name: dllLibraryName,
            path: path.join(distDllPath, '[name].manifest.json')
        })
    ]
}
