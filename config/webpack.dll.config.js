// 当运行 yarn run build-vendor时，会按照此文件进行vendor资源打包
// 作用：尽可能将使用到的第三方资源打包成静态包，加快开发构建的速度
const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');

module.exports = {
    entry: {
        react: ['react', 'react-router-dom', 'react-dom'],
        antd: ['antd'] // 开发环境才会真正使用到这个dll
    },
    output: {
        path: paths.appVendor,
        filename: '[name].dll.js',
        library: '_dll_[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]',
            path: path.join(paths.appVendor, '[name].manifest.json')
        })
    ]
};
