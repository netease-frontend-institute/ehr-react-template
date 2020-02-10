module.exports = {
    host: process.env.HOST, // 默认是：localhost
    port: process.env.PORT, // 默认是：8080
    open: true, // 浏览器自启动
    overlay: true, // 开启浏览器端的错误浮层功能
    hot: true,
    historyApiFallback: {
        rewrites: { from: /^\/index/, to: `/index.html` }
    },
    before() {
        console.clear();
    },
    proxy: {
        '/mock/dev': {
            target: 'http://10.171.160.65:8800',
            secure: false,
            pathRewrite: {
                '^/mock/dev': ''
            },
            changeOrigin: true
        },
        '/mock/test': {
            target: 'http://10.171.160.132:8800',
            secure: false,
            pathRewrite: {
                '^/mock/test': ''
            },
            changeOrigin: true
        },
        '/mock': {
            target: 'http://localhost:3000',
            secure: false,
            pathRewrite: {
                '^/mock': ''
            },
            changeOrigin: true
        }
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    stats: {
        all: undefined,
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        hash: false,
        timings: false,
        assets: false,
        entrypoints: false,
        version: false,
        builtAt: false
    }
};
