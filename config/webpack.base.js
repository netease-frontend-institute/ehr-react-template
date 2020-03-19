const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { isProduction } = require('./env');

module.exports = {
    entry: paths.appIndex,
    externals: {
        // 将CDN形式加载的包从打包范围中移除（业务层的引入方式不变）
        lodash: '_',
        moment: 'moment',
        'moment/locale/zh-cn': 'moment.locale'
    },
    resolve: {
        modules: ['node_modules', paths.appNodeModules],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            '@': paths.appSrc
        }
    },
    module: {
        strictExportPresence: true,
        rules: [{ parser: { requireEnsure: false } }]
    },
    plugins: [
        // 定义（浏览器环境下的）全局常量
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
        // 动态生成html模板插件配置
        new HtmlWebpackPlugin({
            inject: true, // 是否将js放在body的末尾
            hash: false, // 防止缓存，在引入的文件后面加hash (PWA就是要缓存，这里设置为false)
            template: paths.appHtml,
            mobile: true,
            favicon: './public/favicon.ico',
            templateParameters: {
                AntdDllSlot: !isProduction ? `<script src="/vendor/antd.dll.js"></script>` : '',
                ReactDllSlot: !isProduction ? `<script src="/vendor/react.dll.js"></script>` : ''
            },
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                preserveLineBreaks: true,
                removeAttributeQuotes: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
                useShortDoctype: true,
                html5: true
            },
            chunksSortMode: 'dependency'
        }),

        // 打包忽略locale、moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // 与 devServer watchOptions 并存，不监听node_modules
        new webpack.WatchIgnorePlugin([path.join(__dirname, 'node_modules')]),
        new WebpackBar({
            minimal: false,
            compiledIn: false
        })
    ],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },

    performance: {
        hints: false
    },

    //压缩js
    optimization: {
        namedModules: true,
        nodeEnv: 'development'
    }
};
