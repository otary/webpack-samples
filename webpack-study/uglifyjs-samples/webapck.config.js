const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const entryPath = './src/assets/js/';
const outputPath = './src/static/js/';


const entries = (() => {
    let entry = {};
    getEntry(entryPath, function (list) {
        for (let i = 0, item; item = list[i++];) {
            entry[item[0].slice(0, -3)] = item[2];
        }
    });
    return entry;
})();


function getEntry(path, cb) {
    const isFolderExists = fs.existsSync(path);
    const fileList = [];
    if (isFolderExists) {
        const dirList = fs.readdirSync(path);
        dirList.forEach(function (fileName) {
            fileList.push([fileName, path, path + fileName]);
        });
    }
    return cb(fileList);
}

// webpack配置
module.exports = {
    entry: entries,
    mode: 'production',
    output: {
        path: path.resolve(outputPath),
        filename: '[name].min.js',
    },
    optimization: {
        // see https://www.npmjs.com/package/uglifyjs-webpack-plugin
        minimizer: [new UglifyJsPlugin({
            parallel: true,  // 默认: false
           // sourceMap: true, // 默认: false
            uglifyOptions: {
                 warnings: false,
                 parse: {},
                 compress: {
                     drop_console: true, // console
                     drop_debugger: false,
                     pure_funcs: ['console.log'] // 移除console
                 },
                 output:{
                     comments:false  // 去除注释
                 },
                 toplevel: false,
                 nameCache: null,
                 ie8: false,
                 keep_fnames: false,
            },
        })],
    }
};

