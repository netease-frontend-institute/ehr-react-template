import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from '@/components/common/not-found';
import App from './App';

const Page = () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/app/index" push />} />
            <Route path="/app" component={App} />
            <Route component={NotFound} />
        </Switch>
    </Router>
);

export default Page;
