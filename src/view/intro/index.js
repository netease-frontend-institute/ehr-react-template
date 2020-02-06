import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import NotFound from '@/components/not-found';
import 'core-js'; // 兼容IE处理
import '@/assets/iconfont/iconfont.css';
import '@/assets/css/index.less';

const Page = () => (
    <Router basename="/intro.html">
        <Switch>
            <Route exact path="/" component={App} />
            <Route path="/company" component={App} />
            <Route path="/bu" component={App} />
            <Route component={NotFound} />
        </Switch>
    </Router>
);

ReactDOM.render(<Page />, document.getElementById('root'));
