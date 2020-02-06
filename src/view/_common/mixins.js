// 入口文件的公共部分
import { setConfig } from 'react-hot-loader';

// 避免react-hot-loader中热重载无限warning
setConfig({ trackTailUpdates: false });
