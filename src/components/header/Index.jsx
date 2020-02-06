import React from 'react';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';
import './index.less';

function Header(props) {
    return (
        <div className="m-header">
            Header导航：
            <i className="icon-hebingxingzhuang1 icon iconfont"></i>
            <Button href="/">Home</Button>
            <Button href="/intro.html">Intro</Button>
        </div>
    );
}

export default withRouter(Header);
