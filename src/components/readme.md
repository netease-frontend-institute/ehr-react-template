# components文件夹放置示意图
```
components // 公用组件文件夹
│
└───common // 原子组件（公用范围：其它项目也可以拿来直接使用）
│   └───u-icon
│   │   │    Index.jsx
│   │   │    Index.less
│   │   ...
│
└───pc // 业务组件（公用范围：仅在当前项目内的PC端部分）
│   │
│   └───nav
│   │   │    Index.jsx
│   │   │    Index.less
│   │   ...
│
└───mobile // 业务组件（公用范围：仅在当前项目内的移动端部分）
│   │
│   └───nav
│   │   │    Index.jsx
│   │   │    Index.less
│   │   ...
│
└────header // 业务组件（公用范围：PC/Mobile都复用）
│   │   Index.jsx
│   │   Index.less
```