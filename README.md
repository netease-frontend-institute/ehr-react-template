# ehr-react-template（single page application）

## 简介

这是一款**基于 React + Webpack**基础配置的前端`单页（single page application）`项目脚手架。

## 已支持

-   [x] React v16.9.0
-   [x] Webpack v4.39.1
-   [x] ESLint & Stylelint & Prettier
-   [x] Husky
-   [x] HappyPack
-   [x] DLL 动态链接库
-   [x] CDN下载依赖（lodash、moment）
-   [x] react-router v4（BrowserRouter）

未来还可能进行`TypeScript支持`等

## 使用方式
1、安装依赖包
```js
yarn
```

2、运行项目
```
yarn start
```
> `yarn run dev`包含了dll命令，作用是**尽可能将使用到的第三方资源打包成静态包，加快开发构建的速度**；建议在初次/得知vendor资源发生变动后时执行一次。

3、项目打包
```
yarn build
```

## 目录结构

```
project
│   README.md
│   babel.config.js
│   .eslintrc.js
│   .prettierrc.js
│   .stylelintrc.js
│
└───config // webpack、dll配置
│   │   webpack.base.js
│   │   webpack.dev.js
│   │   webpack.prod.js
│   │   ...
│
└───src // 项目源文件
│   │   App.js
│   │   index.js
│   │   Page.js
│   │
|   |____assets // 资源（可被webpack打包）
|   |   | css // 全局css
|   |   | iconfont // 图标文件
|   |   | img // 图片文件
|   |
|   |____axios // 请求
|   |   | api // 接口
|   |   | config.js // 接口环境变量
|   |   | http.js // axios二次封装
|   |   | index.js // 接口统一导出文件
|   |
|   |____components // 组件
│   |   |____common // 通用组件
│   |   |    |   ...
│   |   |
│   |   | ... // 业务组件
|   |
|   |____constants // 常量文件夹
|   |   | common // 全局常量
|   |   | index.js // 出口
|   |   | ... // 其他变量
|   |
|   |____hooks // hooks
│   |   |____common // 通用hooks
│   |   |    |   ...
│   |   |
│   |   | ... // 业务hooks
|   |
|   |____locales // 多语言
|   |
|   |____router // 路由
|   |   | index.js 路由表
|   |   | tools.js 有关路由的工具方法
|   |
|   |____utils // 工具方法
|   |   | tool.js
|   |
|   |____view // 页面
│   |   | ... // 各业务页面（按功能划分）
|
└───public // 静态文件夹
│   │   index.html
|
└───vendor // dll动态链缓存文件夹
│   │
```

## 更新历史
-   v1.4.0—— 2020-03-06
    -   更新react(16.12.0)、antd(4.0.0)
    -   调整dll的生成source模式（导致控制台DevTools failed...提示）

-   v1.3.1—— 2020-02-29
    -   修复router/tools两级以上出现渲染循环问题

-   v1.3.0 —— 2020-02-20
    -   优化router/tools（路由信息获取）
    -   配置文件重命名（webpack、babel、dll）

-   v1.2.2 —— 2020-02-20
    -   移除Page.js
    -   将not-found移至view下

-   v1.2.1 —— 2020-02-19
    -   新增预样式.center()

-   v1.2.0 —— 2020-02-06
    -   美化UI

-   v1.1.8 —— 2019-12-20
    -   四类请求方式传入headers无效问题

-   v1.1.7 —— 2019-11-25
    -   移除addLoadable，所有路由组件改为懒加载（IE无法通过component.name区分）

-   v1.1.6 —— 2019-11-12
    -   优化DLL配置 & 全局配置浏览器常量
    -   配置Axios中rootURL在生产环境下调用的api为绝对路径
    -   引入data-wrapper通用业务组件（可复用页面空态）

-   v1.1.5 —— 2019-10-31
    -   修复useFetch中dispatch依赖重新定义问题

-   v1.1.4 —— 2019-10-27
    -   移除国际化配置
    -   修复iconfont无效问题

-   v1.1.3 —— 2019-10-22
    -   在入口文件index.js中引入全局less

-   v1.1.2 —— 2019-10-21
    -   引入style-resources-loader & 移除方法getLessVariables
    -   支持Less Parametric Mixins（带参数的混合：.font-normal）

-   v1.1.1 —— 2019-10-20
    -   统一改为BrowserRouter（按需引入，参考intro）
    -   修复`<Routes />`无法传参的bug

-   v1.1.0 —— 2019-10-15
    -   引入HappyPack
    -   将lodash、moment从打包范围移除
    -   将antd打包进vendor（仅在开发模式下）
    -   将antd的默认加载图标改为按需加载（src/utils/antd-icon.js）

-   v1.0.0 —— 2019-10-10
    -   支持多层子路由渲染（`<Routes />`）
    -   支持热更新
    -   优化目录结构（router、constans等）
    -   优化组件懒加载的使用方式

-   v0.0.4 —— 2019-08-28
    -   增加全局样式
    -   优化布局方案
    -   国际化方案

-   v0.0.3 —— 2019-08-27
    -   优化axios响应拦截器，直接返回response.data至业务层

-   v0.0.2 —— 2019-08-21
    -   优化axios，对Server错误进行统一处理
    -   语义化Server Code
    -   支持全局引入"variables.less"

-   v0.0.1 —— 2019-08-20
    -   模板项目雏形
    -   引入 hooks 参考 doc/hook.md
    -   优化axios目录结构

## License

The code is distributed under the [MIT](https://opensource.org/licenses/MIT) license
