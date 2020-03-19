import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from '@/view/not-found';
import App from './App';
import '@/assets/iconfont/iconfont.css';
import '@/assets/css/index.less';

const Page = () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/app/index" push />} />
            <Route path="/app" component={App} />
            <Route component={NotFound} />
        </Switch>
    </Router>
);

ReactDOM.render(<Page />, document.getElementById('root'));
