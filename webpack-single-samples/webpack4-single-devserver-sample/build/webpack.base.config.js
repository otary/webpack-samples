const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = path.resolve(process.cwd());
const srcPath = path.resolve(rootPath, 'src');
const distPath = path.resolve(rootPath, 'dist');
const assetsPath = path.join(srcPath, 'assets');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/main.js'
    },
    output: {
        path: distPath,
        filename: 'assets/js/[name].js',

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
            test: /\.(sa|sc|c)ss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    // hmr: process.env.NODE_ENV === 'development',
                },
            }, 'css-loader', {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        require('postcss-import')(),
                        require('autoprefixer')({
                            browsers: ['last 30 versions', "> 2%", "Firefox >= 10", "ie 6-11"]
                        })
                    ]
                }
            }, 'sass-loader']
        }, {
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader'
            }],

            // 排除 node_modules 目录下的文件（node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换）
            exclude: /node_modules/
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
            use: ['vue-loader'],
            exclude: /node_modules/
        }]
    },
    resolve: {
        alias: {
            '@': srcPath,
            '@assets': assetsPath,
            '@scss': path.join(assetsPath, 'scss'),
            'vue$': 'vue/dist/vue.common.js'
        },
        extensions: ['.js', '.vue', '.json', '.css', '.scss']
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 300,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 1,
            maxInitialRequests: 1,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendor: {
                    name: "vendor",
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]/,
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/template.html',
            filename: 'index.html',
            chunks: 'all',
            favicon: path.join(assetsPath, 'icon.ico')
        }),
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: `assets/css/[name]_[contenthash:8].css`,
            ignoreOrder: false
        }),
        new ParallelUglifyPlugin({
            uglifyJS: {
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有注释
                    comments: false,
                },
                compress: {
                    // 删除所有console语句，可以兼容IE浏览器
                    drop_console: true,
                    // 内嵌已定义但是只用到一次的变量
                    collapse_vars: true
                }
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        // 压缩css插件配置
        new OptimizeCssAssetsWebpackPlugin()
    ],
    devServer: {
        contentBase: srcPath
    }
}
