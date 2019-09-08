const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const {AutoWebPlugin} = require('web-webpack-plugin');
//const AutoDllPlugin = require('autodll-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');


const pagePath = './src/pages';
const srcPath = path.resolve(process.cwd(), 'src');
const distPath = path.resolve(process.cwd(), 'dist');
const assetsPath = path.join(srcPath, 'assets');
const distDllPath = path.join(distPath, 'dll');

const autoWebPlugin = new AutoWebPlugin(pagePath, {
    template: (pageName) => {
        return path.resolve(pagePath, pageName, 'template.html');
    },
    // 生成的文件名
    filename: (pageName) => {
        return path.join('views', pageName, 'index');
    },
    // 生成pagemap.json
    outputPagemap: true,
    hash: true,

    // 提取公共代码
    /* commonsChunk: {
         name: 'vendor',
         minChunks: 2,
         filename: 'assets/[name]/js/[name]-[chunkhash:8].js'
     },*/

    //preEntrys: [path.join(distDllPath, 'vendor.dll.css')],

    // 引入其它chunk
    requires: ['vendor_dll', 'vendor_css_dll']
});

module.exports = {
    entry: autoWebPlugin.entry({
        vendor_dll: [path.join(distDllPath, 'vendor.dll.js')],
        vendor_css_dll: [path.join(distDllPath, 'vendor.dll.css')]
    }),
    output: {
        path: distPath,
        filename: 'assets/[name]/js/[name].js',

        // 使用绝对路径
        publicPath: '/'
    },
    module: {
        rules: [{
            test: require.resolve('jquery'), // require.resolve 用来获取模块的绝对路径
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            }, {
                loader: 'expose-loader',
                options: '$'
            }]
        }, {
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
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ['css-loader', 'less-loader']
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
        }, {
            test: /\.vue$/,
            use: ['vue-loader']
        }]
    },
    resolve:
        {
            alias: {
                '@': srcPath,
                '@assets': assetsPath,
                '@scss': path.join(assetsPath, 'scss'),
                '@dll': distDllPath,
                'vue$': 'vue/dist/vue.common.js'
            }
            ,
            extensions: ['.js', '.vue', '.json', '.css', '.scss']
        }
    ,
    plugins: [
        autoWebPlugin,
        new VueLoaderPlugin(),
        new ExtractTextPlugin({
            filename: `assets/[name]/css/[name]_[contenthash:8].css`
        }),
        /*new AutoDllPlugin({
            inject: true, 
            filename: '[name].dll.js',
            entry: {
                vendor: [
                    'jquery',
                    'bootstrap'
                ]
            }
        }),*/
        new ParallelUglifyPlugin({
            uglifyJS: {
                output: {
                    //最紧凑的输出
                    beautify: false,
                    //删除所有注释
                    comments: false,
                },
                compress: {
                    //删除所有console语句，可以兼容IE浏览器
                    drop_console: true,
                    //内嵌已定义但是只用到一次的变量
                    collapse_vars: true
                }
            }
        })

    ],
    devServer: {
        //contentBase: pagePath
    }
}