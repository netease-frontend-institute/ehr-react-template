import React from 'react';
import { withRouter } from 'react-router-dom';
import './index.less';

function Home() {
    return <div className="m-home">首页</div>;
}

export default withRouter(Home);
