const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const { getEntry, getHtmlWebpackPluginConfigs } = require('./tools');
const { isProduction } = require('./env');

module.exports = {
    entry: getEntry(),
    externals: {
        // 将CDN形式加载的包从打包范围中移除（业务层的引入方式不变）
        lodash: '_',
        moment: 'moment',
        'moment/locale/zh-cn': 'moment.locale'
    },
    resolve: {
        modules: ['node_modules', paths.appNodeModules],
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            '@ant-design/icons/lib/dist$': paths.antdIcon,
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
        ...getHtmlWebpackPluginConfigs(),

        // 打包忽略locale、moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // 与 devServer watchOptions 并存，不监听node_modules
        new webpack.WatchIgnorePlugin([path.join(__dirname, 'node_modules')]),
        new WebpackBar({
            name: `🚚  当前项目：react-template-multipages | ${isProduction ? '打包预计1min' : '编译预计3~5s'}\r\n`, //进度条描述
            minimal: false,
            compiledIn: false,
            color: '#377ab7' //进度条颜色
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
