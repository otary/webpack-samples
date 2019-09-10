const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const rootPath = path.resolve(process.cwd());
const srcPath = path.resolve(rootPath, 'src');
const distPath = path.resolve(rootPath, 'dist');
const assetsPath = path.join(srcPath, 'assets');
const distDllPath = path.join(distPath, 'dll');

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
            }, 'css-loader', 'postcss-loader', 'sass-loader']
        }, {
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader'
            }],

            // 排除 node_modules 目录下的文件（node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换）
            exclude: /node_modules/
        }, {
            test: /\.(gif|png|jpe?g|pdf)$/,
            use: ['file-loader']
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'assets/media/[name].[hash:7].[ext]'
            }
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
        }, {
            test: /\.vue$/,
            use: ['vue-loader'],
            exclude: /node_modules/
        }]
    },
    resolve: {
        // 寻找模块的根目录，默认以node_modules为根目录
        modules: ['node_modules'],
        alias: {
            '@': srcPath,
            '@assets': assetsPath,
            '@scss': path.join(assetsPath, 'scss')
        },
        extensions: ['.js', '.vue', '.json', '.css', '.scss']
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue: ['vue']
        }),
        new HtmlWebpackPlugin({
            template: 'src/template.html',
            filename: 'index.html',
            //chunks: 'all',
            favicon: path.join(assetsPath, 'img/favicon.ico')
        }),
        new DllReferencePlugin({
            context: __dirname,
            manifest: require(path.join(distDllPath, 'vendor.manifest.json'))
        }),
        new DllReferencePlugin({
            context: __dirname,
            manifest: require(path.join(distDllPath, 'vue.manifest.json'))
        }),
        //new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: `assets/css/[name]_[contenthash:8].css`,
            ignoreOrder: false
        }),
        //使用ParallelUglifyPlugin 并行压缩输出的JavaScript代码
        new ParallelUglifyPlugin({
            uglifyJS: {
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有注释
                    comments: false
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
        new OptimizeCssAssetsWebpackPlugin(),
        // 添加资源文件
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['dll/vendor.dll.js', 'dll/vendor.dll.css', 'dll/vue.dll.js'],
            append: false
        }),
       /* new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),*/
    ],
    devServer: {
        contentBase: srcPath
    }
}

