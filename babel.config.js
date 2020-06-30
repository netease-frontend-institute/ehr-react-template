module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false, // 关闭babel的模块转换，才能使用Webpack的Tree-Shaking功能
                targets: {
                    browsers: ['>1%', 'last 2 versions', 'safari >= 7']
                }
            }
        ],
        '@babel/preset-react'
    ],
    plugins: [
        'react-hot-loader/babel',
        '@babel/plugin-transform-runtime',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true
            }
        ]
    ],
    ignore: ['xxx.js', 'xxx/**/*.js']
};
