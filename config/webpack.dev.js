const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HappyPack = require('happypack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanTerminalPlugin } = require('./tools');
const baseWebpackConfig = require('./webpack.base');
const devServer = require('./webpack-dev-server.config');
const paths = require('./paths');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    cache: true,
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    output: {
        path: paths.appBuild,
        publicPath: '/',
        filename: 'static/js/[name].bundle.js',
        chunkFilename: 'static/js/[name].chunk.js',
        devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: 'happypack/loader?id=happyESLint',
                include: paths.appSrc
            },
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    },
                    {
                        test: /\.less$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 2,
                                    sourceMap: false
                                }
                            },
                            require.resolve('postcss-loader'),
                            {
                                loader: require.resolve('less-loader'),
                                options: {
                                    sourceMap: false,
                                    javascriptEnabled: true
                                }
                            },
                            {
                                loader: 'style-resources-loader',
                                options: {
                                    patterns: [
                                        path.resolve(paths.appCss, 'variables.less'),
                                        path.resolve(paths.appCss, 'antd-reset.less'),
                                        path.resolve(paths.appCss, 'function.less')
                                    ],
                                    injector: 'append'
                                }
                            }
                        ],
                        sideEffects: true
                    },
                    {
                        test: /\.(js|jsx)$/,
                        include: paths.appSrc,
                        exclude: /node_modules/,
                        use: 'happypack/loader?id=happyBabel'
                    },
                    {
                        test: /\.css$/,
                        exclude: /node_modules/,
                        include: paths.appSrc,
                        use: 'happypack/loader?id=happyCSS'
                    },
                    {
                        exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanTerminalPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),

        // 加载React（以DLL的形式）
        new webpack.DllReferencePlugin({
            manifest: path.join(paths.appVendor, 'react.manifest.json')
        }),

        // 直接拷贝vendor资源目录
        new CopyWebpackPlugin([
            {
                from: paths.appVendor, // vendor资源目录源地址
                to: path.join(paths.appBuild, 'vendor') //目标地址，相对于output的path目录
            }
        ]),

        new HappyPack({
            id: 'happyCSS',
            threads: 4,
            loaders: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        importLoaders: 1
                    }
                },
                require.resolve('postcss-loader')
            ],
            verbose: false
        }),

        new HappyPack({
            id: 'happyBabel',
            threads: 4,
            loaders: [
                {
                    loader: require.resolve('babel-loader'),
                    options: {
                        customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                        plugins: [
                            [
                                require.resolve('babel-plugin-named-asset-import'),
                                {
                                    loaderMap: {
                                        svg: {
                                            ReactComponent: '@svgr/webpack?-svgo![path]'
                                        }
                                    }
                                }
                            ],
                            ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]
                        ],
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: false
                    }
                }
            ],
            verbose: false
        }),

        new HappyPack({
            id: 'happyESLint',
            threads: 5,
            loaders: [
                {
                    options: {
                        formatter: require.resolve('react-dev-utils/eslintFormatter'),
                        eslintPath: require.resolve('eslint')
                    },
                    loader: require.resolve('eslint-loader')
                }
            ],
            verbose: false
        })
    ],
    devServer
});

module.exports = webpackConfig;
