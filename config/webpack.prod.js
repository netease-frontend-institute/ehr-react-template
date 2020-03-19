const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const baseWebpackConfig = require('./webpack.base');
const paths = require('./paths');
const { sourceMapEnabled } = require('./env');

const webpackConfig = smp.wrap(
    merge(baseWebpackConfig, {
        mode: 'production',
        devtool: 'cheap-module-source-map',
        output: {
            path: paths.appBuild,
            filename: 'static/js/[name].[chunkhash:8].js',
            chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
            publicPath: '/',
            devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        },
        module: {
            rules: [
                {
                    test: /\.(j|t)sx?$/,
                    enforce: 'pre',
                    use: [
                        {
                            options: {
                                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                                eslintPath: require.resolve('eslint')
                            },
                            loader: require.resolve('eslint-loader')
                        }
                    ],
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
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: require.resolve('css-loader'),
                                    options: {
                                        importLoaders: 2,
                                        sourceMap: sourceMapEnabled
                                    }
                                },
                                require.resolve('postcss-loader'),
                                {
                                    loader: require.resolve('less-loader'),
                                    options: {
                                        sourceMap: sourceMapEnabled,
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
                            test: /\.(j|t)sx?$/,
                            include: paths.appSrc,
                            exclude: /node_modules/,
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
                                cacheCompression: true,
                                compact: true
                            }
                        },
                        {
                            test: /\.css$/,
                            exclude: /node_modules/,
                            include: paths.appSrc,
                            use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')]
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
            new CleanWebpackPlugin(),
            // new BundleAnalyzerPlugin(),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
            }),

            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                    safe: true
                }
            }), // use OptimizeCSSAssetsPlugin
            new webpack.HashedModuleIdsPlugin()
        ],
        optimization: {
            minimize: true,
            concatenateModules: true,
            // 通过提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)。
            minimizer: [
                // This is only used in production mode
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            // we want terser to parse ecma 8 code. However, we don't want it
                            // to apply any minfication steps that turns valid ecma 5 code
                            // into invalid ecma 5 code. This is why the 'compress' and 'output'
                            // sections only apply transformations that are ecma 5 safe
                            // https://github.com/facebook/create-react-app/pull/4234
                            ecma: 8
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            // Disabled because of an issue with Uglify breaking seemingly valid code:
                            // https://github.com/facebook/create-react-app/issues/2376
                            // Pending further investigation:
                            // https://github.com/mishoo/UglifyJS2/issues/2011
                            comparisons: false,
                            // Disabled because of an issue with Terser breaking valid code:
                            // https://github.com/facebook/create-react-app/issues/5250
                            // Pending futher investigation:
                            // https://github.com/terser-js/terser/issues/120
                            inline: 2
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            // Turned on because emoji and regex is not minified properly using default
                            // https://github.com/facebook/create-react-app/issues/2488
                            ascii_only: true
                        }
                    },
                    // Use multi-process parallel running to improve the build speed
                    // Default number of concurrent runs: os.cpus().length - 1
                    parallel: true,
                    // Enable file caching
                    cache: true,
                    sourceMap: true
                }),
                // This is only used in production mode
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: false
                    }
                })
            ],
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                // 缓存组会继承/覆盖上面的选项
                cacheGroups: {
                    // 抽离各入口之间可共享的所有代码
                    commons: {
                        name: 'commons',
                        chunks: 'initial', // 共有三个值可选：initial(动态模块)、async(非动态模块)和all(全部模块)
                        minChunks: 2, // 模块被引用>=2次，便分割
                        maxInitialRequests: 5, // 一个入口并发加载的chunk数量<=3
                        minSize: 0
                    },
                    // 抽离antd组件
                    antd: {
                        name: 'chunk-antd', // 单独将 antd 拆包
                        priority: 15, // 权重需大于其它缓存组
                        test: /[/]node_modules[/]antd[/]/
                    },
                    // 抽离第三方插件
                    vendor: {
                        name: 'vendor',
                        test: /node_modules\/(.*)\.js/, // 表示拆分node_modules中的模块
                        chunks: 'initial',
                        priority: 10,
                        reuseExistingChunk: false
                        // enforce: true
                    },
                    styles: {
                        name: 'styles',
                        test: /\.(css)$/,
                        chunks: 'all',
                        minChunks: 1,
                        reuseExistingChunk: true,
                        enforce: true
                    }
                }
            },
            // Keep the runtime chunk separated to enable long term caching
            // 生成runtime chunk，以达到优化持久化缓存的目的
            runtimeChunk: true
        },
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
            warningsFilter: warn => warn.indexOf('Conflicting order between:') > -1 // if true will ignore
        }
    })
);

module.exports = webpackConfig;
