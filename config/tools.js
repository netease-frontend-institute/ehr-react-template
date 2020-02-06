const fs = require('fs');
const glob = require('glob');
const path = require('path');
const paths = require('./paths');
const env = require('./env');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 动态扫描入口文件
const getEntry = () => {
    let entries = {};
    let polyfillPath = '@babel/polyfill';
    glob.sync(path.resolve(paths.appSrc, 'view/*/index.js')).forEach(function(fileDir) {
        let pathObj = path.parse(fileDir);
        let entryName = pathObj.dir.match(/\/[\w-]+$/g)[0].split('/')[1]; // 用文件夹名字作为入口名。
        entries[entryName] = [polyfillPath, fileDir];
    });

    // 仅返回指定的入口文件
    const singleEntry = process.env.ENTRY;
    if (singleEntry && entries[singleEntry]) {
        return {
            [singleEntry]: entries[singleEntry]
        };
    }
    return entries;
};

// 入口集合（防止执行多次getEntry）
const entries = getEntry();

// 动态生成模板文件
const getHtmlWebpackPluginConfigs = () => {
    let htmlPlugins = [];

    for (let [entryName] of Object.entries(entries)) {
        const appPath = path.join(process.cwd(), './src');
        let htmlFilePath = `${appPath}/view/${entryName}/index.html`;

        // 若在当前view里找不到对应index.html，则使用public的
        if (!fs.existsSync(htmlFilePath)) {
            htmlFilePath = paths.appHtml;
        }

        const plugin = new HtmlWebpackPlugin({
            inject: true,
            hash: false,
            template: htmlFilePath,
            filename: `${entryName}.html`,
            chunks: ['commons', 'chunk-antd', 'styles', entryName],
            favicon: paths.appFavicon,
            templateParameters: {
                AntdDllSlot: !env.isProduction ? `<script src="/vendor/antd.dll.js"></script>` : '',
                ReactDllSlot: !env.isProduction ? `<script src="/vendor/react.dll.js"></script>` : ''
            },
            ...(env.isProduction
                ? {
                      minify: {
                          removeComments: true,
                          collapseWhitespace: true,
                          removeRedundantAttributes: true,
                          useShortDoctype: true,
                          removeEmptyAttributes: true,
                          removeStyleLinkTypeAttributes: true,
                          keepClosingSlash: true,
                          minifyJS: true,
                          minifyCSS: true,
                          minifyURLs: true
                      }
                  }
                : {})
        });
        htmlPlugins.push(plugin);
    }
    return htmlPlugins;
};

// 插件：保存时clear日志
class CleanTerminalPlugin {
    constructor(options = {}) {
        this.time = 0;
    }

    apply(compiler) {
        this.useCompilerHooks(compiler);
    }

    useCompilerHooks(compiler) {
        compiler.hooks.afterCompile.tap('CleanTerminalPlugin', () => this.clearConsole());
    }

    clearConsole() {
        if (this.time > 2) {
            console.clear();
        } else {
            this.time++;
        }
    }
}

module.exports = {
    entries,
    getEntry,
    getHtmlWebpackPluginConfigs,
    CleanTerminalPlugin
};
