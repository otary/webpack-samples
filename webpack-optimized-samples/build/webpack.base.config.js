const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const {AutoWebPlugin} = require('web-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HappyPack = require('happypack');

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
    /*commonsChunk: {
        name: 'vendor',
        minChunks: 2,
        filename: 'assets/[name]/js/[name]-[hash:8].js'
    },*/

    // 引入其它chunk
    //requires: ['vendor_dll']
});

module.exports = {
    entry: autoWebPlugin.entry({
        // vendor_dll: [path.join(distDllPath, 'vendor.dll.js')],
        // vendor_css_dll: [path.join(distDllPath, 'vendor.dll.css')]
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
            test: /\.(sa|sc|c)ss$/,
            loaders: ExtractTextPlugin.extract({
                use: ['css-loader', 'postcss-loader', 'sass-loader'],
                fallback: 'style-loader'
            })
        }, {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            // 使用 HappyPack 加速构建
            use: ['happypack/loader?id=babel'],
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
    // 输出构建性能信息（用于分析说明原因导致构建性能不佳）
    profile: true,

    // 监听模式
    watchOptions: {
        // 不监听的文件或者文件夹，支持正则匹配，默认为空
        ignored: /node_modules/,
        // 监听到变化后等300ms在执行动作，截流防止文件更新太快导致重新编译频率太快
        aggregateTimeout: 300,
        // 不停的询问系统指定的文件有没有发生变化，默认每秒询问1000次
        poll: 1000
    },
    resolve: {
        alias: {
            '@': srcPath,
            '@assets': assetsPath,
            '@scss': path.join(assetsPath, 'scss'),
            '@dll': distDllPath,
            'vue$': 'vue/dist/vue.common.js'
        },
        extensions: ['.js', '.vue', '.json', '.css', '.scss']
    },
    plugins: [
        autoWebPlugin,
        new VueLoaderPlugin(),
        new ExtractTextPlugin({
            filename: `assets/[name]/css/[name]_[hash:8].css`
        }),
        new DllReferencePlugin({
            manifest: require(path.join(distDllPath, 'vendor_dll.manifest.json'))
        }),
        // 使用 HappyPack 加速构建
        new HappyPack({
            id: 'babel',
            // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
            loaders: ['babel-loader?cacheDirectory']
        }),
        new ParallelUglifyPlugin({
            uglifyJS: {
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有注释
                    comments: false,
                },
                // 在 UglifyJS 删除没有用到的代码时不输出警告
                warnings: false,
                compress: {
                    // 删除所有console语句，可以兼容IE浏览器
                    drop_console: true,
                    // 内嵌已定义但是只用到一次的变量
                    collapse_vars: true
                }
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        //压缩css插件配置
        new OptimizeCssAssetsWebpackPlugin()
    ],
    devServer: {
        contentBase: pagePath
    }
}
