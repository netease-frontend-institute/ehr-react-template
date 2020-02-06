import React from 'react';
import ReactDOM from 'react-dom';
import Page from './Page';
import 'core-js'; // 兼容IE处理
import '@/assets/iconfont/iconfont.css';
import '@/assets/css/index.less';

const render = Component => ReactDOM.render(<Component />, document.getElementById('root'));

render(Page);
